ALTER TABLE `users` ADD `re` text;--> statement-breakpoint
ALTER TABLE `users` ADD `rank` text;--> statement-breakpoint
ALTER TABLE `users` ADD `war_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `unit` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_re_unique` ON `users` (`re`);