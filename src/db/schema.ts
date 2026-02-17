
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
