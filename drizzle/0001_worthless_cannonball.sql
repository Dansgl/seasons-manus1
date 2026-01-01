CREATE TABLE `boxItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`boxId` int NOT NULL,
	`inventoryItemId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `boxItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `boxes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`cycleNumber` int NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`returnByDate` date NOT NULL,
	`status` enum('selecting','confirmed','shipped','active','swap_pending','returned','completed') NOT NULL DEFAULT 'selecting',
	`shippingLabelUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boxes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`sku` varchar(100) NOT NULL,
	`state` enum('available','active','in_transit','quarantine','retired') NOT NULL DEFAULT 'available',
	`conditionNotes` text,
	`quarantineUntil` date,
	`retirementReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `inventoryItems_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('bodysuit','sleepsuit','joggers','jacket','cardigan','top','bottom','dress','outerwear','swimwear','hat','shoes','pjs','overall') NOT NULL,
	`ageRange` enum('0-3m','3-6m','6-12m','12-18m','18-24m') NOT NULL,
	`season` enum('summer','winter','all-season') NOT NULL,
	`rrpPrice` decimal(10,2) NOT NULL,
	`imageUrl` varchar(500),
	`ozoneCleaned` boolean NOT NULL DEFAULT true,
	`insuranceIncluded` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('active','paused','cancelled') NOT NULL DEFAULT 'active',
	`cycleStartDate` date NOT NULL,
	`cycleEndDate` date NOT NULL,
	`nextBillingDate` date NOT NULL,
	`swapWindowOpen` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `shippingAddress` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);