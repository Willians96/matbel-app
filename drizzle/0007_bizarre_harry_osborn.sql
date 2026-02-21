CREATE TABLE `treinamento_itens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`treinamento_id` text NOT NULL,
	`arma_id` integer,
	`colete_id` integer,
	`algema_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`treinamento_id`) REFERENCES `treinamentos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arma_id`) REFERENCES `armas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`colete_id`) REFERENCES `coletes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`algema_id`) REFERENCES `algemas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `treinamentos` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`user_id` text NOT NULL,
	`municao_id` integer,
	`municao_qty` integer DEFAULT 0 NOT NULL,
	`capsules_qty` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending_acceptance' NOT NULL,
	`confirmed_at` integer,
	`returned_at` integer,
	`signature` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`municao_id`) REFERENCES `municoes`(`id`) ON UPDATE no action ON DELETE no action
);
