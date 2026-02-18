CREATE TABLE `declarations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_re` text NOT NULL,
	`user_name` text NOT NULL,
	`user_rank` text,
	`user_unit` text NOT NULL,
	`gun_serial_number` text,
	`vest_serial_number` text,
	`has_handcuffs` integer DEFAULT false,
	`handcuffs_serial_number` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT true,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `units_name_unique` ON `units` (`name`);