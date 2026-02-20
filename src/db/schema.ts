
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

// ─── Armas ───────────────────────────────────────────────────────────────────
export const armas = sqliteTable('armas', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patrimony: text('patrimony').unique().notNull(),     // Unique, never "0008"
    serialNumber: text('serial_number').unique().notNull(), // Unique, never "0009"
    name: text('name').notNull(),                        // Nome do Material
    caliber: text('caliber'),                            // Tiros/Calibre (ex: .40 S&W)
    finish: text('finish'),                              // Acabamento (ex: Oxidada Negra)
    manufacturer: text('manufacturer'),                  // Fabricante
    observations: text('observations'),
    status: text('status', { enum: ['disponivel', 'em_uso', 'manutencao', 'baixado'] })
        .default('disponivel').notNull(),
    userId: text('user_id').references(() => users.id), // null = disponível
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ─── Coletes ─────────────────────────────────────────────────────────────────
export const coletes = sqliteTable('coletes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patrimony: text('patrimony').unique().notNull(),     // Unique
    serialNumber: text('serial_number').unique().notNull(),
    name: text('name').notNull(),                        // Nome (ex: Colete Balístico Nível III-A)
    model: text('model'),                                // Modelo
    size: text('size'),                                  // Tamanho (P/M/G/GG/XGG)
    expiresAt: integer('expires_at', { mode: 'timestamp' }), // Vencimento
    observations: text('observations'),
    status: text('status', { enum: ['disponivel', 'em_uso', 'manutencao', 'baixado'] })
        .default('disponivel').notNull(),
    userId: text('user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ─── Algemas ─────────────────────────────────────────────────────────────────
// Algemas SEM registro usam patrimony='0008' e serialNumber='0009' como sentinela.
// Estes são os ÚNICOS valores que se repetem em todo o BD.
// O controle de algemas sem registro é feito por quantidade (ver campo stockQty em cargas).
export const algemas = sqliteTable('algemas', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    patrimony: text('patrimony').notNull(),               // '0008' = sem patrimônio
    serialNumber: text('serial_number').notNull(),        // '0009' = sem série
    name: text('name').notNull(),                        // Nome do Material
    brand: text('brand'),                                // Marca
    model: text('model'),                                // Modelo
    observations: text('observations'),
    // hasRegistry: true = item individual rastreável; false = pool por quantidade
    hasRegistry: integer('has_registry', { mode: 'boolean' }).default(true).notNull(),
    // totalQty: para algemas sem registro (hasRegistry=false) controla o estoque do pool
    totalQty: integer('total_qty').default(0).notNull(),
    availableQty: integer('available_qty').default(0).notNull(),
    status: text('status', { enum: ['disponivel', 'em_uso', 'manutencao', 'baixado'] })
        .default('disponivel').notNull(),
    userId: text('user_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ─── Munições ─────────────────────────────────────────────────────────────────
// Controle por lote. Cada lote tem estoque disponível que é subtraído a cada carga.
export const municoes = sqliteTable('municoes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    batch: text('batch').unique().notNull(),              // LOTE (identificador único do lote)
    description: text('description').notNull(),           // DESCRIÇÃO (ex: PTN .40 S&W)
    type: text('type').notNull(),                         // TIPO (ex: FMJ, JHP, Treino)
    expiresAt: integer('expires_at', { mode: 'timestamp' }), // Validade
    observations: text('observations'),
    totalQty: integer('total_qty').default(0).notNull(),  // Qtd total recebida
    availableQty: integer('available_qty').default(0).notNull(), // Qtd disponível na reserva
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ─── Cargas ───────────────────────────────────────────────────────────────────
// Agregação de múltiplos itens numa única carga para um policial.
// Todos os itens são opcionais — uma carga pode ter qualquer combinação.
export const cargas = sqliteTable('cargas', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

    // Partes envolvidas
    adminId: text('admin_id').references(() => users.id).notNull(),
    userId: text('user_id').references(() => users.id).notNull(),

    // Itens vinculados (todos opcionais)
    armaId: integer('arma_id').references(() => armas.id),
    coleteId: integer('colete_id').references(() => coletes.id),
    algemaId: integer('algema_id').references(() => algemas.id),
    // Para algemas sem registro: quantidade retirada do pool
    algemaQty: integer('algema_qty').default(0).notNull(),
    municaoId: integer('municao_id').references(() => municoes.id),
    // Quantidade de munição entregue (subtraída do lote no momento de confirmação)
    municaoQty: integer('municao_qty').default(0).notNull(),

    // Controle de fluxo
    // pending_acceptance: carga criada, aguardando aceite do policial
    // confirmed: policial aceitou (itens ficam em_uso)
    // returned: policial devolveu tudo
    status: text('status', {
        enum: ['pending_acceptance', 'confirmed', 'returned']
    }).default('pending_acceptance').notNull(),

    confirmedAt: integer('confirmed_at', { mode: 'timestamp' }),
    signature: text('signature'), // Hash de verificação gerado no aceite
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});
