CREATE TABLE `algemas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patrimony` text NOT NULL,
	`serial_number` text NOT NULL,
	`name` text NOT NULL,
	`brand` text,
	`model` text,
	`observations` text,
	`has_registry` integer DEFAULT true NOT NULL,
	`total_qty` integer DEFAULT 0 NOT NULL,
	`available_qty` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'disponivel' NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `armas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patrimony` text NOT NULL,
	`serial_number` text NOT NULL,
	`name` text NOT NULL,
	`caliber` text,
	`finish` text,
	`manufacturer` text,
	`observations` text,
	`status` text DEFAULT 'disponivel' NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `armas_patrimony_unique` ON `armas` (`patrimony`);--> statement-breakpoint
CREATE UNIQUE INDEX `armas_serial_number_unique` ON `armas` (`serial_number`);--> statement-breakpoint
CREATE TABLE `cargas` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`user_id` text NOT NULL,
	`arma_id` integer,
	`colete_id` integer,
	`algema_id` integer,
	`algema_qty` integer DEFAULT 0 NOT NULL,
	`municao_id` integer,
	`municao_qty` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending_acceptance' NOT NULL,
	`confirmed_at` integer,
	`signature` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arma_id`) REFERENCES `armas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`colete_id`) REFERENCES `coletes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`algema_id`) REFERENCES `algemas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`municao_id`) REFERENCES `municoes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coletes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patrimony` text NOT NULL,
	`serial_number` text NOT NULL,
	`name` text NOT NULL,
	`model` text,
	`size` text,
	`expires_at` integer,
	`observations` text,
	`status` text DEFAULT 'disponivel' NOT NULL,
	`user_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coletes_patrimony_unique` ON `coletes` (`patrimony`);--> statement-breakpoint
CREATE UNIQUE INDEX `coletes_serial_number_unique` ON `coletes` (`serial_number`);--> statement-breakpoint
CREATE TABLE `municoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`batch` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`expires_at` integer,
	`observations` text,
	`total_qty` integer DEFAULT 0 NOT NULL,
	`available_qty` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `municoes_batch_unique` ON `municoes` (`batch`);