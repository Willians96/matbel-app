
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // Clerk ID
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
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
