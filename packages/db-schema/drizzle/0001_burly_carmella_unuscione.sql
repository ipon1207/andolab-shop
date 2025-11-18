CREATE TABLE `products` (
	`product_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_name` text NOT NULL,
	`price` integer NOT NULL,
	`type` text NOT NULL,
	`stock` integer NOT NULL,
	`jan_code` text,
	`is_deleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_jan_code_unique` ON `products` (`jan_code`);--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
DROP TABLE `users`;