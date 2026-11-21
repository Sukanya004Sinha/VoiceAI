const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID, timingSafeEqual } = require("node:crypto");
const { processMessage } = require("./agent.js");
const database = require("./db.js");
const { documents: ragDocuments } = require("./rag.js");

const port = Number(process.env.PORT || 3000);
const publicDirectory = path.join(__dirname, "public");

const providers = [
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    specialty: "General physician",
    specialtyHi: "सामान्य चिकित्सक",
    specialtyTa: "பொது மருத்துவர்",
    experience: "12 years",
    languages: ["हिंदी", "English", "ಕನ್ನಡ"],
    location: "Indiranagar, Bengaluru",
    rating: "4.9",
    fee: 400,
    initials: "AR",
    color: "#e5f1ea"
  },
  {
    id: "karthik-iyer",
    name: "Dr. Karthik Iyer",
    specialty: "General physician",
    specialtyHi: "सामान्य चिकित्सक",
    specialtyTa: "பொது மருத்துவர்",
    experience: "9 years",
    languages: ["தமிழ்", "English", "हिंदी"],
    location: "Koramangala, Bengaluru",
    rating: "4.8",
    fee: 350,
    initials: "KI",
    color: "#f6eadb"
  },
  {
    id: "meera-shah",
    name: "Dr. Meera Shah",
    specialty: "Family medicine",
    specialtyHi: "पारिवारिक चिकित्सक",
    specialtyTa: "குடும்ப மருத்துவர்",
    experience: "15 years",
    languages: ["हिंदी", "English", "ગુજરાતી"],
    location: "HSR Layout, Bengaluru",
    rating: "4.9",
    fee: 500,
    initials: "MS",
    color: "#eee8f5"
  }
];

for (const provider of providers) database.seedProvider(provider);
for (const document of ragDocuments) database.seedRagDocument(document);

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  return dateToIso(new Date(year, month - 1, day)) === value;
}

function formatSlot(date, time) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const dateValue = new Date(year, month - 1, day, hour, minute);
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(dateValue);
  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(dateValue);
  return { id: `${date}T${time}`, date, time, label: `${dateLabel} · ${timeLabel}` };
}

function makeSlots(date, providerId, hours = [9, 10, 11, 12, 13, 14, 15, 16]) {
  const now = new Date();
  return hours
    .map((hour) => formatSlot(date, `${String(hour).padStart(2, "0")}:00`))
    .filter((slot) => {
      const [year, month, day] = slot.date.split("-").map(Number);
      const [hour, minute] = slot.time.split(":").map(Number);
      if (new Date(year, month - 1, day, hour, minute) <= now) return false;
      return !database.appointmentExistsForSlot(providerId, slot.id);
    });
}

function parseSlotId(slotId) {
  const match = typeof slotId === "string" && slotId.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);
  if (!match || !isValidDateString(match[1])) return null;
  const hour = Number(match[2].slice(0, 2));
  const minute = Number(match[2].slice(3, 5));
  if (hour < 9 || hour > 16 || minute !== 0) return null;
  const [year, month, day] = match[1].split("-").map(Number);
  const dateTime = new Date(year, month - 1, day, hour, minute);
  if (dateTime <= new Date()) return null;
  return formatSlot(match[1], match[2]);
}

function validPrescriptionText(value, maxLength) {
  return value == null || (typeof value === "string" && value.trim().length <= maxLength);
}

function hasValidAdminToken(request) {
  const expected = process.env.PRESCRIPTION_API_TOKEN;
  const supplied = request.headers.authorization?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

async function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "Bharat Health Voice",
      llm: process.env.LLM_API_URL
        ? `${process.env.LLM_MODEL || "configured-model"} (${process.env.LLM_API_URL})`
        : `${process.env.LLM_MODEL || "qwen3:4b"} (local Ollama)`,
      rag: "local-knowledge",
      tools: ["find_doctors", "get_slots", "create_booking", "schedule_follow_up", "read_prescription", "write_clinician_prescription"],
      database: database.path
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/agent/chat") {
    let input;
    try {
      input = await readJson(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return;
    }

    const message = typeof input.message === "string" ? input.message.trim() : "";
    if (!message) {
      sendJson(response, 400, { error: "A message is required." });
      return;
    }

    let pendingBookingId = typeof input.pendingBookingId === "string" ? input.pendingBookingId : null;
    let userId = null;
    if (typeof input.userName === "string" && input.userName.trim()) {
      const existingUser = database.findUserByName(input.userName.trim());
      userId = existingUser?.id || randomUUID();
      database.upsertUser({ id: userId, displayName: input.userName.trim(), language: input.language || "hi-IN" });
    }

    const result = await processMessage({
      message,
      language: input.language || "hi-IN",
      conversation: Array.isArray(input.conversation) ? input.conversation : [],
      tools: {
        findDoctors: () => true,
        scheduleFollowUp: async () => {
          if (!pendingBookingId) return { ok: false };
          const booking = database.findAppointment(pendingBookingId);
          if (!booking) return { ok: false };
          if (!database.findFollowUp(pendingBookingId)) {
            database.insertFollowUp({
              id: randomUUID(),
              appointmentId: pendingBookingId,
              scheduleLabel: "7 days after the appointment (demo)",
              notificationSent: false,
              createdAt: new Date().toISOString()
            });
          }
          return { ok: true };
        }
      }
    });

    database.insertConversation({
      id: randomUUID(),
      userId,
      language: input.language || "hi-IN",
      role: "user",
      message,
      intent: result.intent,
      ragSources: result.ragSources,
      llmUsed: result.llmUsed,
      toolCalls: result.toolCalls
    });
    sendJson(response, 200, result);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/providers") {
    sendJson(response, 200, { providers: database.listProviders() });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/slots") {
    const provider = database.findProvider(url.searchParams.get("providerId"));
    if (!provider) {
      sendJson(response, 404, { error: "Doctor not found." });
      return;
    }

    const requestedDate = url.searchParams.get("date");
    const requestedTime = url.searchParams.get("time");
    if (requestedDate && !isValidDateString(requestedDate)) {
      sendJson(response, 400, { error: "Date must use the YYYY-MM-DD format." });
      return;
    }

    const dates = requestedDate
      ? [requestedDate]
      : Array.from({ length: 7 }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() + index);
          return dateToIso(date);
        });
    const allSlots = dates.flatMap((date) => makeSlots(date, provider.id));
    const requestedTimeAvailable = requestedTime
      ? allSlots.some((slot) => slot.date === requestedDate && slot.time === requestedTime)
      : null;
    const outsideClinicHours = requestedTime
      ? !/^([01]\d|2[0-3]):[0-5]\d$/.test(requestedTime)
        || Number(requestedTime.slice(0, 2)) < 9
        || Number(requestedTime.slice(0, 2)) > 16
        || Number(requestedTime.slice(3, 5)) !== 0
      : false;
    const selectedDaySlots = requestedDate
      ? allSlots.filter((slot) => slot.date === requestedDate)
      : allSlots.filter((slot, index) => index % 8 === 0 || slot.time === "12:00" || slot.time === "16:00");
    const availableSlots = requestedTimeAvailable
      ? selectedDaySlots.filter((slot) => slot.time === requestedTime)
      : selectedDaySlots;
    sendJson(response, 200, {
      provider,
      date: requestedDate || null,
      requestedTime: requestedTime || null,
      requestedTimeAvailable,
      outsideClinicHours,
      slots: availableSlots
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/bookings") {
    let input;
    try {
      input = await readJson(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return;
    }

    const providerRow = database.findProvider(input.providerId);
    const provider = providerRow ? { id: providerRow.id, name: providerRow.name } : null;
    const slot = parseSlotId(input.slotId);
    const patientName = typeof input.patientName === "string" ? input.patientName.trim() : "";
    if (!provider || !slot || patientName.length < 1 || patientName.length > 80) {
      sendJson(response, 400, { error: "A valid doctor, appointment time, and patient name are required." });
      return;
    }
    if (database.appointmentExistsForSlot(provider.id, slot.id)) {
      sendJson(response, 409, { error: "That appointment time has just been booked. Please choose another." });
      return;
    }

    const booking = {
      id: randomUUID(),
      patientName,
      providerId: provider.id,
      providerName: provider.name,
      slotId: slot.id,
      appointmentTime: slot.label,
      language: input.language || "hi-IN",
      reminder: "Demo reminder recorded for 24 hours before the visit; no notification is sent.",
      followUp: null,
      createdAt: new Date().toISOString()
    };

    let userId = null;
    const existingUser = database.findUserByName(patientName);
    if (existingUser) {
      userId = existingUser.id;
    } else {
      userId = randomUUID();
      database.upsertUser({ id: userId, displayName: patientName, language: input.language || "hi-IN" });
    }

    database.insertAppointment({
      id: booking.id,
      userId,
      patientName,
      providerId: provider.id,
      providerName: provider.name,
      slotId: slot.id,
      appointmentTime: slot.label,
      language: input.language || "hi-IN",
      reminder: booking.reminder,
      createdAt: booking.createdAt
    });
    sendJson(response, 201, { booking });
    return;
  }

  const patientPrescriptionPath = url.pathname.match(/^\/api\/appointments\/([0-9a-f-]+)\/prescription$/i);
  if (request.method === "GET" && patientPrescriptionPath) {
    const appointment = database.findAppointment(patientPrescriptionPath[1]);
    if (!appointment) {
      sendJson(response, 404, { error: "Appointment not found." });
      return;
    }
    sendJson(response, 200, { prescription: database.getPrescription(appointment.id) });
    return;
  }

  const clinicianPrescriptionPath = url.pathname.match(/^\/api\/admin\/appointments\/([0-9a-f-]+)\/prescription$/i);
  if (request.method === "POST" && clinicianPrescriptionPath) {
    if (!process.env.PRESCRIPTION_API_TOKEN) {
      sendJson(response, 503, { error: "Clinician prescription entry is not enabled. Configure PRESCRIPTION_API_TOKEN first." });
      return;
    }
    if (!hasValidAdminToken(request)) {
      sendJson(response, 401, { error: "A valid clinician API token is required." });
      return;
    }

    let input;
    try {
      input = await readJson(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return;
    }

    const appointment = database.findAppointment(clinicianPrescriptionPath[1]);
    if (!appointment) {
      sendJson(response, 404, { error: "Appointment not found." });
      return;
    }
    if (database.getPrescription(appointment.id)) {
      sendJson(response, 409, { error: "A prescription has already been issued for this appointment." });
      return;
    }
    if (typeof input.clinicianName !== "string"
      || !input.clinicianName.trim()
      || input.clinicianName.trim().length > 120
      || !validPrescriptionText(input.clinicalNotes, 2_000)
      || !Array.isArray(input.items)
      || input.items.length < 1
      || input.items.length > 20) {
      sendJson(response, 400, { error: "A clinician name, valid notes, and 1-20 medicine entries are required." });
      return;
    }

    const fields = ["medicationName", "strength", "dosage", "route", "frequency", "duration", "instructions"];
    const invalidItem = input.items.some((item) => !item
      || typeof item.medicationName !== "string"
      || !item.medicationName.trim()
      || fields.some((field) => !validPrescriptionText(item[field], field === "instructions" ? 500 : 120)));
    if (invalidItem) {
      sendJson(response, 400, { error: "Each medicine needs a name; medicine details must be valid text." });
      return;
    }

    const prescriptionId = randomUUID();
    const prescription = {
      id: prescriptionId,
      appointmentId: appointment.id,
      providerId: appointment.provider_id,
      providerName: appointment.provider_name,
      clinicianName: input.clinicianName.trim(),
      clinicalNotes: typeof input.clinicalNotes === "string" ? input.clinicalNotes.trim() : null,
      issuedAt: new Date().toISOString(),
      items: input.items.map((item) => ({
        id: randomUUID(),
        medicationName: item.medicationName.trim(),
        strength: item.strength?.trim() || null,
        dosage: item.dosage?.trim() || null,
        route: item.route?.trim() || null,
        frequency: item.frequency?.trim() || null,
        duration: item.duration?.trim() || null,
        instructions: item.instructions?.trim() || null
      }))
    };
    database.insertPrescription(prescription);
    sendJson(response, 201, { prescription: database.getPrescription(appointment.id) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/follow-ups") {
    let input;
    try {
      input = await readJson(request);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
      return;
    }

    const booking = database.findAppointment(input.bookingId);
    if (!booking) {
      sendJson(response, 404, { error: "Appointment not found." });
      return;
    }
    if (database.findFollowUp(input.bookingId)) {
      sendJson(response, 409, { error: "A follow-up is already recorded for this appointment." });
      return;
    }
    const followUp = {
      id: randomUUID(),
      appointmentId: input.bookingId,
      scheduleLabel: "7 days after the appointment (demo)",
      notificationSent: false,
      createdAt: new Date().toISOString()
    };
    database.insertFollowUp(followUp);
    sendJson(response, 201, { followUp: { schedule_label: followUp.scheduleLabel, notification_sent: 0, created_at: followUp.createdAt } });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/admin/appointments") {
    sendJson(response, 200, { appointments: database.listAppointments() });
    return;
  }

  sendJson(response, 404, { error: "API route not found." });
}

function serveStatic(request, response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.resolve(publicDirectory, `.${requestedPath}`);
  if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Unable to read file.");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(request, response, url).catch((error) => {
      console.error("API request failed:", error);
      if (!response.headersSent) sendJson(response, 500, { error: "The service could not complete that request." });
    });
    return;
  }
  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end("Method not allowed");
    return;
  }
  serveStatic(request, response, url);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Bharat Health Voice is running at http://127.0.0.1:${port}`);
});
