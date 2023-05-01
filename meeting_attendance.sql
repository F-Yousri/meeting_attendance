-- Adminer 4.8.1 MySQL 8.0.33 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `meeting_attendance`;
CREATE TABLE `meeting_attendance` (
  `meeting_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `joined_at` timestamp NULL DEFAULT NULL,
  `left_at` timestamp NULL DEFAULT NULL,
  `duration` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2023-05-01 09:42:07
