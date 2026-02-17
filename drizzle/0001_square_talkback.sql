ALTER TABLE `equipamentos` ADD `patrimony` text;--> statement-breakpoint
ALTER TABLE `equipamentos` ADD `unit` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `equipamentos_patrimony_unique` ON `equipamentos` (`patrimony`);