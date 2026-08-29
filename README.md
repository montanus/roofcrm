docker build  -t roofcrm .
gcloud builds submit -t us-east1-docker.pkg.dev/olgadance-218922/monty-reservations-frontend/roofcrm ./~



DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first` varchar(100) NOT NULL,
  `last` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jobType` varchar(50) NOT NULL,
  `stage` varchar(50) NOT NULL,
  `notes` text,
  `price` decimal(13,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `gdrive` text,
  `salesperson` varchar(255) DEFAULT NULL,
  `sortorder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `costs` (
    `id` int NOT NULL,
    `job_id` int NOT NULL,
    `cost_type` varchar(50) NOT NULL,
    `cost_desc` text,
    `cost_cost`  DECIMAL(13, 2), 
    `cost_percent`  DECIMAL(13, 2),
    PRIMARY KEY (id),
    FOREIGN KEY (job_id) REFERENCES job(id)
);


CREATE TABLE `job` (
    `id` int NOT NULL,
    `customer_id` int NOT NULL,
    `job_type` varchar(50) NOT NULL,
    `stage` varchar(50) NOT NULL,
    `contract_price`  DECIMAL(13, 2), 
    `gdrive` text,
    `job_desc` text,
    `sort_order` int,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);


sql user G@ofer