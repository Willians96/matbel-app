CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`equipment_id` integer NOT NULL,
	`user_re` text NOT NULL,
	`user_name` text NOT NULL,
	`user_rank` text,
	`user_unit` text NOT NULL,
	`checkout_date` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`return_date` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipamentos`(`id`) ON UPDATE no action ON DELETE no action
);
