const Database = require("better-sqlite3");
const path = require("node:path");

const databasePath = process.env.DB_PATH || path.join(__dirname, "data", "voice-ai.sqlite");
const fs = require("node:fs");
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'hi-IN',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    language TEXT NOT NULL,
    role TEXT NOT NULL,
    message TEXT NOT NULL,
    intent TEXT,
    rag_sources TEXT,
    llm_used INTEGER NOT NULL DEFAULT 0,
    tool_calls TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    specialty_hi TEXT,
    specialty_ta TEXT,
    experience TEXT,
    languages TEXT,
    location TEXT,
    rating TEXT,
    fee INTEGER,
    initials TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    patient_name TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    slot_id TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    language TEXT NOT NULL,
    reminder TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY,
    appointment_id TEXT NOT NULL UNIQUE,
    schedule_label TEXT NOT NULL,
    notification_sent INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    appointment_id TEXT NOT NULL UNIQUE,
    provider_id TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    clinician_name TEXT NOT NULL,
    clinical_notes TEXT,
    issued_at TEXT NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
  );

  CREATE TABLE IF NOT EXISTS prescription_items (
    id TEXT PRIMARY KEY,
    prescription_id TEXT NOT NULL,
    medication_name TEXT NOT NULL,
    strength TEXT,
    dosage TEXT,
    route TEXT,
    frequency TEXT,
    duration TEXT,
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS rag_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hi TEXT,
    title_ta TEXT,
    keywords TEXT NOT NULL,
    text_en TEXT,
    text_hi TEXT,
    text_ta TEXT,
    updated_at TEXT NOT NULL
  );
`);

const statements = {
  upsertUser: db.prepare(`INSERT INTO users (id, display_name, language, created_at, updated_at)
    VALUES (@id, @display_name, @language, @created_at, @updated_at)
    ON CONFLICT(id) DO UPDATE SET display_name=excluded.display_name, language=excluded.language, updated_at=excluded.updated_at`),
  findUserByName: db.prepare("SELECT * FROM users WHERE display_name = ? ORDER BY created_at DESC LIMIT 1"),
  insertConversation: db.prepare(`INSERT INTO conversations
    (id, user_id, language, role, message, intent, rag_sources, llm_used, tool_calls, created_at)
    VALUES (@id, @user_id, @language, @role, @message, @intent, @rag_sources, @llm_used, @tool_calls, @created_at)`),
  insertProvider: db.prepare(`INSERT OR REPLACE INTO providers
    (id, name, specialty, specialty_hi, specialty_ta, experience, languages, location, rating, fee, initials, color)
    VALUES (@id, @name, @specialty, @specialty_hi, @specialty_ta, @experience, @languages, @location, @rating, @fee, @initials, @color)`),
  findProvider: db.prepare("SELECT * FROM providers WHERE id = ?"),
  listProviders: db.prepare("SELECT * FROM providers ORDER BY name"),
  insertAppointment: db.prepare(`INSERT INTO appointments
    (id, user_id, patient_name, provider_id, provider_name, slot_id, appointment_time, language, reminder, status, created_at)
    VALUES (@id, @user_id, @patient_name, @provider_id, @provider_name, @slot_id, @appointment_time, @language, @reminder, 'confirmed', @created_at)`),
  findAppointment: db.prepare("SELECT * FROM appointments WHERE id = ?"),
  appointmentExistsForSlot: db.prepare("SELECT id FROM appointments WHERE provider_id = ? AND slot_id = ? LIMIT 1"),
  insertFollowUp: db.prepare(`INSERT OR IGNORE INTO follow_ups
    (id, appointment_id, schedule_label, notification_sent, created_at)
    VALUES (@id, @appointment_id, @schedule_label, @notification_sent, @created_at)`),
  findFollowUp: db.prepare("SELECT * FROM follow_ups WHERE appointment_id = ?"),
  listAppointments: db.prepare("SELECT * FROM appointments ORDER BY created_at DESC LIMIT 100"),
  insertPrescription: db.prepare(`INSERT INTO prescriptions
    (id, appointment_id, provider_id, provider_name, clinician_name, clinical_notes, issued_at)
    VALUES (@id, @appointment_id, @provider_id, @provider_name, @clinician_name, @clinical_notes, @issued_at)`),
  insertPrescriptionItem: db.prepare(`INSERT INTO prescription_items
    (id, prescription_id, medication_name, strength, dosage, route, frequency, duration, instructions)
    VALUES (@id, @prescription_id, @medication_name, @strength, @dosage, @route, @frequency, @duration, @instructions)`),
  findPrescription: db.prepare("SELECT * FROM prescriptions WHERE appointment_id = ?"),
  listPrescriptionItems: db.prepare("SELECT * FROM prescription_items WHERE prescription_id = ? ORDER BY rowid"),
  upsertRagDocument: db.prepare(`INSERT INTO rag_documents
    (id, title, title_hi, title_ta, keywords, text_en, text_hi, text_ta, updated_at)
    VALUES (@id, @title, @title_hi, @title_ta, @keywords, @text_en, @text_hi, @text_ta, @updated_at)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title, title_hi=excluded.title_hi, title_ta=excluded.title_ta,
      keywords=excluded.keywords, text_en=excluded.text_en, text_hi=excluded.text_hi, text_ta=excluded.text_ta,
      updated_at=excluded.updated_at`),
  listRagDocuments: db.prepare("SELECT * FROM rag_documents")
};

function serializeJson(value) {
  return JSON.stringify(value == null ? [] : value);
}

const database = {
  path: databasePath,
  upsertUser(input) {
    const now = new Date().toISOString();
    statements.upsertUser.run({
      id: input.id,
      display_name: input.displayName,
      language: input.language || "hi-IN",
      created_at: now,
      updated_at: now
    });
  },
  findUserByName(displayName) {
    return statements.findUserByName.get(displayName);
  },
  insertConversation(input) {
    statements.insertConversation.run({
      id: input.id,
      user_id: input.userId || null,
      language: input.language,
      role: input.role,
      message: input.message,
      intent: input.intent || null,
      rag_sources: serializeJson(input.ragSources),
      llm_used: input.llmUsed ? 1 : 0,
      tool_calls: serializeJson(input.toolCalls),
      created_at: new Date().toISOString()
    });
  },
  seedProvider(provider) {
    statements.insertProvider.run({
      id: provider.id,
      name: provider.name,
      specialty: provider.specialty,
      specialty_hi: provider.specialtyHi,
      specialty_ta: provider.specialtyTa,
      experience: provider.experience,
      languages: JSON.stringify(provider.languages),
      location: provider.location,
      rating: provider.rating,
      fee: provider.fee,
      initials: provider.initials,
      color: provider.color
    });
  },
  listProviders() {
    return statements.listProviders.all().map((row) => ({
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      specialtyHi: row.specialty_hi,
      specialtyTa: row.specialty_ta,
      experience: row.experience,
      languages: JSON.parse(row.languages || "[]"),
      location: row.location,
      rating: row.rating,
      fee: row.fee,
      initials: row.initials,
      color: row.color
    }));
  },
  findProvider(id) {
    return statements.findProvider.get(id);
  },
  appointmentExistsForSlot(providerId, slotId) {
    return Boolean(statements.appointmentExistsForSlot.get(providerId, slotId));
  },
  insertAppointment(input) {
    statements.insertAppointment.run({
      id: input.id,
      user_id: input.userId || null,
      patient_name: input.patientName,
      provider_id: input.providerId,
      provider_name: input.providerName,
      slot_id: input.slotId,
      appointment_time: input.appointmentTime,
      language: input.language,
      reminder: input.reminder,
      created_at: input.createdAt
    });
  },
  findAppointment(id) {
    return statements.findAppointment.get(id);
  },
  insertPrescription(input) {
    const insertAll = db.transaction(() => {
      statements.insertPrescription.run({
        id: input.id,
        appointment_id: input.appointmentId,
        provider_id: input.providerId,
        provider_name: input.providerName,
        clinician_name: input.clinicianName,
        clinical_notes: input.clinicalNotes || null,
        issued_at: input.issuedAt
      });
      for (const item of input.items) {
        statements.insertPrescriptionItem.run({
          id: item.id,
          prescription_id: input.id,
          medication_name: item.medicationName,
          strength: item.strength || null,
          dosage: item.dosage || null,
          route: item.route || null,
          frequency: item.frequency || null,
          duration: item.duration || null,
          instructions: item.instructions || null
        });
      }
    });
    insertAll();
  },
  getPrescription(appointmentId) {
    const prescription = statements.findPrescription.get(appointmentId);
    if (!prescription) return null;
    return {
      id: prescription.id,
      appointmentId: prescription.appointment_id,
      providerId: prescription.provider_id,
      providerName: prescription.provider_name,
      clinicianName: prescription.clinician_name,
      clinicalNotes: prescription.clinical_notes,
      issuedAt: prescription.issued_at,
      items: statements.listPrescriptionItems.all(prescription.id).map((item) => ({
        medicationName: item.medication_name,
        strength: item.strength,
        dosage: item.dosage,
        route: item.route,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions
      }))
    };
  },
  insertFollowUp(input) {
    statements.insertFollowUp.run({
      id: input.id,
      appointment_id: input.appointmentId,
      schedule_label: input.scheduleLabel,
      notification_sent: input.notificationSent ? 1 : 0,
      created_at: input.createdAt
    });
  },
  findFollowUp(appointmentId) {
    return statements.findFollowUp.get(appointmentId);
  },
  listAppointments() {
    return statements.listAppointments.all();
  },
  seedRagDocument(document) {
    statements.upsertRagDocument.run({
      id: document.id,
      title: document.title,
      title_hi: document.titleHi,
      title_ta: document.titleTa,
      keywords: JSON.stringify(document.keywords),
      text_en: document.text,
      text_hi: document.textHi,
      text_ta: document.textTa,
      updated_at: new Date().toISOString()
    });
  }
};

module.exports = database;
