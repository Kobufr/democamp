CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`profile` text NOT NULL,
	`records` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `campgrounds` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
