CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`googlePlaceId` varchar(255),
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(500),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`imageUrl` varchar(500),
	`rating` varchar(10),
	`reviewCount` int DEFAULT 0,
	`openingHours` text,
	`city` varchar(100),
	`neighborhood` varchar(100),
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`),
	CONSTRAINT `businesses_googlePlaceId_unique` UNIQUE(`googlePlaceId`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `searchKeywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`categoryId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchKeywords_id` PRIMARY KEY(`id`)
);
