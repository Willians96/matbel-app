
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // Clerk ID
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),

    // Dados Profissionais (Profile)
    re: text('re').unique(), // Registro Estatístico
    rank: text('rank'), // Posto/Graduação
    warName: text('war_name'), // Nome de Guerra
    unit: text('unit'), // Unidade

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const equipamentos = sqliteTable('equipamentos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    serialNumber: text('serial_number').unique().notNull(),
    patrimony: text('patrimony').unique(), // New field
    name: text('name').notNull(),
    category: text('category').notNull(),
    unit: text('unit').notNull(), // New field
    status: text('status', { enum: ['disponivel', 'em_uso', 'manutencao', 'baixado'] }).default('disponivel').notNull(),
    acquisitionDate: integer('acquisition_date', { mode: 'timestamp' }),
    observations: text('observations'),
    userId: text('user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable("transactions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    equipmentId: integer("equipment_id").references(() => equipamentos.id).notNull(),

    // Dados do Policial (Snapshot no momento da retirada)
    userRe: text("user_re").notNull(),
    userName: text("user_name").notNull(), // Nome de Guerra
    userRank: text("user_rank"), // Posto/Graduação (Sd, Cb, Sgt...)
    userUnit: text("user_unit").notNull(),

    checkoutDate: integer("checkout_date", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    returnDate: integer("return_date", { mode: "timestamp" }),

    status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
    notes: text("notes"),
});

export const declarations = sqliteTable("declarations", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id).notNull(),

    // User Snapshot
    userRe: text("user_re").notNull(),
    userName: text("user_name").notNull(),
    userRank: text("user_rank"),
    userUnit: text("user_unit").notNull(),

    // Declared Items
    gunSerialNumber: text("gun_serial_number"),
    vestSerialNumber: text("vest_serial_number"),
    hasHandcuffs: integer("has_handcuffs", { mode: "boolean" }).default(false),
    handcuffsSerialNumber: text("handcuffs_serial_number"),

    // Process Control
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
    adminNotes: text("admin_notes"),

    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const units = sqliteTable("units", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique().notNull(),
    active: integer("active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const transfers = sqliteTable("transfers", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    equipmentId: integer("equipment_id").references(() => equipamentos.id).notNull(),

    // Admin (From/To)
    adminId: text("admin_id").references(() => users.id),

    // User (From/To)
    userId: text("user_id").references(() => users.id).notNull(),

    type: text("type", { enum: ["allocation", "return"] }).notNull(), // allocation: Admin->User, return: User->Admin
    status: text("status", { enum: ["pending", "confirmed", "rejected"] }).default("pending").notNull(),

    // Digital Receipt
    signature: text("signature"), // Hash code
    timestamp: integer("timestamp", { mode: "timestamp" }),

    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
