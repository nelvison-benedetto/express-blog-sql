-- MySQL dump for Manga Database
-- Version: 1.0
-- Server version: 8.0

-- Create database
DROP DATABASE IF EXISTS `mangas_db`;
CREATE DATABASE `mangas_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mangas_db`;

-- Table structure for `manga`
DROP TABLE IF EXISTS `manga`;
CREATE TABLE `manga` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `file` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `visibility` ENUM('post', 'archive') DEFAULT 'post'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for `tags`
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for `manga_tags` (many-to-many relationship)
DROP TABLE IF EXISTS `manga_tags`;
CREATE TABLE `manga_tags` (
  `manga_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`manga_id`, `tag_id`),
  FOREIGN KEY (`manga_id`) REFERENCES `manga` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data into `tags`
INSERT INTO `tags` (`id`, `label`) VALUES
(1, 'Isekai'),
(2, 'Fantasy'),
(3, 'Mecha'),
(4, 'Romantic Comedy'),
(5, 'Slice of Life');

-- Insert data into `manga`
INSERT INTO `manga` (`id`, `slug`, `title`, `content`, `price`, `file`, `category`, `visibility`) VALUES
(1, 'dungeon-reset', 'Dungeon Reset', 'A tale of a hero who gets a second chance in a magical world.', 15.99, 'imgcover/dungeonreset.jpg', 'Shonen', 'post'),
(2, 'kill-the-hero', 'Kill the Hero', 'Epic battles between colossal robots in a dystopian future.', 19.99, 'imgcover/killthehero.png', 'Seinen', 'archive'),
(3, 'martial-peak', 'Martial Peak', 'A romantic comedy about unlikely friends finding love.', 12.49, 'imgcover/martialpeak.jpg', 'Shojo', 'post'),
(4, 'return-of-the-mount-hua-sect', 'Return of the Mount Hua Sect', 'Young mages discover their powers and unravel ancient mysteries.', 17.00, 'imgcover/mounthua.jpg', 'Josei', 'archive'),
(5, 'one-piece', 'One Piece', 'Adventures across the stars with a diverse team of explorers.', 20.99, 'imgcover/onepiece.jpg', 'Shonen', 'post'),
(6, 'one-punch-man', 'One-Punch Man', 'Wholesome adventures of kids in a magical countryside.', 10.50, 'imgcover/onepunch.jpg', 'Kodomo', 'post');

-- Insert data into `manga_tags`
INSERT INTO `manga_tags` (`manga_id`, `tag_id`) VALUES
(1, 1), -- Dungeon Reset: Isekai
(1, 2), -- Dungeon Reset: Fantasy
(2, 3), -- Kill the Hero: Mecha
(2, 2), -- Kill the Hero: Fantasy
(3, 4), -- Martial Peak: Romantic Comedy
(3, 5), -- Martial Peak: Slice of Life
(4, 2), -- Return of the Mount Hua Sect: Fantasy
(4, 5), -- Return of the Mount Hua Sect: Slice of Life
(5, 3), -- One Piece: Mecha
(5, 1), -- One Piece: Isekai
(6, 5), -- One-Punch Man: Slice of Life
(6, 2); -- One-Punch Man: Fantasy
