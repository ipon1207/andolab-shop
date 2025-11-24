CREATE TABLE `supply_logs` (
	`supply_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`supplied_at` integer NOT NULL,
	`quantity` integer NOT NULL,
	`cost` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
