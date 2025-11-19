CREATE TABLE `purchase_logs` (
	`log_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`sold_at` integer NOT NULL,
	`sold_price` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
