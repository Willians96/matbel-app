CREATE TABLE `transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`equipment_id` integer NOT NULL,
	`admin_id` text,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`signature` text,
	`timestamp` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipamentos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
