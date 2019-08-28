-- Database: classmysql.engr.oregonstate.edu

-- Edit this to be your own.
USE cs361_chaaras;
-- 
-- 
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `score`;
DROP TABLE IF EXISTS `candidate`;
DROP TABLE IF EXISTS `office`;
DROP TABLE IF EXISTS `answer`;
DROP TABLE IF EXISTS `political_profile`;
DROP TABLE IF EXISTS `demographic_profile`;
DROP TABLE IF EXISTS `account`;
DROP TABLE IF EXISTS `region_question`;
DROP TABLE IF EXISTS `question`;
DROP TABLE IF EXISTS `issue`;
DROP TABLE IF EXISTS `region`;



-- entries for all city state combinations
CREATE TABLE `region` (
	`rId` int(10) NOT NULL AUTO_INCREMENT,
	`city` varchar(50),
	`state` varchar(50),
	PRIMARY KEY (rId)
) ENGINE=InnoDB;

-- this stores the issues that the questions are tied to
-- the issue is stored as a varchar

CREATE TABLE `issue` (
	`iId` int(10) NOT NULL AUTO_INCREMENT,
	`issue` varchar(62), 
	PRIMARY KEY (iId)
) ENGINE=InnoDB;

-- stores the question in varchar
-- iId is a foreign key that references the issue table.  It can be null, because region-specific questions may not have an issue
-- the economic and personal_freedom fields stores the number of points the question moves the users score along the respective axis
-- the general field is true if this question is asked of everyone, false if it is for a specific region

CREATE TABLE `question` (
	`qId` int(10) NOT NULL AUTO_INCREMENT,
	`question` varchar(200),
	`iId` int(10),
	`economic_freedom` int(10), 
	`personal_freedom` int(10),
	`general` bool,
	PRIMARY KEY (qId),
	FOREIGN KEY (`iId`) REFERENCES `issue` (`iId`)
) ENGINE=InnoDB;

CREATE TABLE `account` (
	`accountId` int(10) NOT NULL AUTO_INCREMENT,
	`name` varchar(50),
	`username` varchar(50) UNIQUE NOT NULL,
	`password` varchar(10) BINARY NOT NULL, 
	`email` varchar(50) UNIQUE NOT NULL, 
	`picture` varchar(50), 
	`appVersion` float(10),
	`regionId` int(10), 
	FOREIGN KEY (`regionId`) REFERENCES `region`(`rId`),
	PRIMARY KEY (`accountId`)
) ENGINE=InnoDB;


CREATE TABLE `demographic_profile` (
	`dId` int(10) NOT NULL AUTO_INCREMENT,
	`accountId` int(10),
	`age` int(4),
	`gender` varchar(10), 
	`education` varchar(50),
	`married` varchar(10), 
	PRIMARY KEY (dId),
	FOREIGN KEY (`accountId`) REFERENCES `account`(`accountId`)
) ENGINE=InnoDB;

-- represents the users overall political score
-- this is calculated by the political profile builder

CREATE TABLE `political_profile` (
	`pId` int(10) NOT NULL AUTO_INCREMENT,
	`accountId` int(10),
	`economic_freedom` int(10), 
	`personal_freedom` int(10),
	PRIMARY KEY (pId),
	FOREIGN KEY (`accountId`) REFERENCES `account`(`accountId`)
) ENGINE=InnoDB;
-- high personal freedom, lower economic freedom (degree left)
-- high economic freedom, lower personal freedom (degree right)
-- low personal freedom, low economic freedom (degree authoritarian)
-- high personal freedom, high economic freedom (degree libertarian)

-- stores the evaluation data for an answer from a user
-- each answer is tied to a specific question and account
-- the users Likert scale response is stored as an int from 0-4
-- "survery instance" collects answer IDs and then sends them to the 
-- political builder to calculate the overall political profile
-- Also, "meta-tags" are written about in our outline but using them is only relevant for a more 
-- sophisticated version of the app

CREATE TABLE `answer` (
	`qId` int(10) NOT NULL,
	`accountId` int(10) NOT NULL,
	`answer` tinyint unsigned,
	`meta_tag` varchar(50),
	PRIMARY KEY (`qId`, `accountId`),
	FOREIGN KEY (`qId`) REFERENCES `question` (`qId`),
	FOREIGN KEY (`accountId`) REFERENCES `account` (`accountId`)
) ENGINE=InnoDB;

-- This table links a question to a specific region
CREATE TABLE `region_question` (
	`rId` int(10) NOT NULL,
	`qId` int(10) NOT NULL,
	PRIMARY KEY (`rId`,`qId`),
	FOREIGN KEY (`rId`) REFERENCES `region` (`rId`) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (`qId`) REFERENCES `question` (`qId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- This table holds the offices a candidate can run for
CREATE table `office`(
	`oId` int(10) NOT NULL AUTO_INCREMENT,
	`title` varchar(256),
	`rId` int(10),
	PRIMARY KEY (`oId`),
	FOREIGN KEY (`rId`) REFERENCES `region` (`rId`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- This table holds the candidates, which is an accountId linked to an office id
CREATE TABLE `candidate` (
	`cId` int(10) NOT NULL AUTO_INCREMENT,
	`accountId` int(10) NOT NULL,
	`oId` int(10) NOT NULL,
	PRIMARY KEY (`cId`),
	FOREIGN KEY (`accountId`) REFERENCES `account` (`accountId`), 
	FOREIGN KEY (`oId`) REFERENCES `office` (`oId`)
) ENGINE=InnoDB;

-- This table holds the users match percentage to each candidate
CREATE TABLE `score` (
	`accountId` int(10) NOT NULL,
	`cid`int(10) NOT NULL,
	`score` int(3),
	PRIMARY KEY (`accountId`,`cId`),
	FOREIGN KEY (`accountId`) REFERENCES `account` (`accountId`), 
	FOREIGN KEY (`cId`) REFERENCES `account` (`accountId`)
) ENGINE=InnoDB;

INSERT INTO `issue` (issue) VALUES
('Regulation'), ('Economic Distribution'), ('Social Welfare'), ('Taxation'), ('Human Rights');

INSERT INTO `question` (question, economic_freedom, personal_freedom, general, iId) VALUES
('Marijuana should be legal.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Regulation')),
('Government should ensure that all citizens meet a certain minimum standard of living.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Social Welfare')),
('The rich should pay a higher tax rate than the middle class.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Economic Distribution')),
('Access to healthcare is a right.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Social Welfare')),
('Public radio and television funded by the state provide a valuable service the citizens.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Social Welfare')),
('The rich are too highly taxed.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Taxation')),
('The freer the market, the freer the people.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Regulation')),
('The only social responsibility of a company should be to deliver a profit to its shareholders.', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Economic Distribution')),
('Abortion, when the woman''s life is not threatened, should always be illegal', -4, 0, TRUE,  (SELECT iId FROM issue WHERE issue = 'Human Rights'));
												
INSERT INTO `account` (accountId, name, username, password, email, picture) VALUES
(1, 'Kanye West', 'na1', 'na', 'na1@na', 'kanye2.png'),
(2, 'Donald Trump', 'na2', 'na', 'na2@na', 'trump2.png'),
(3, 'John MacAfee', 'na3', 'na', 'na3@na', 'macafee2.png'),
(4, 'Ted Cruz', 'na4', 'na', 'na4@na', 'cruz2.png'),
(5, 'Alexandria Ocasio-Cortez', 'na5', 'na', 'na5@na', 'cortez2.png'),
(6, 'Bernie Sanders', 'na6', 'na', 'na6@na', 'sanders2.png'),
(7, 'Gary Johnson', 'na7', 'na', 'na7@na', 'johnson2.png'),
(8, 'Mark Cuban', 'na8', 'na', 'na8@na', 'cuban2.png'),
(9, 'Elizabeth Warren', 'na9', 'na', 'na9@na', 'warren2.png'),
(10, 'Ben Shapiro', 'na10', 'na', 'na10@na', 'shapiro2.png');

INSERT INTO `political_profile` (accountId, economic_freedom, personal_freedom) VALUES
(1, 7, 9),
(2, 5, 6),
(3, 10, 10),
(4, 7, 3),
(5, 2, 7),
(6, 3, 6),
(7, 5, 5),
(8, 6, 6),
(9, 4, 6),
(10, 9, 6);

-- Region 1 will be used for national elections
INSERT INTO `region` (rId) VALUES
(1);


INSERT INTO `office` (rId, title) VALUES
(1, "President of the United States");

INSERT INTO `candidate` (accountId, oId) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1);

INSERT INTO `answer` (accountId, qId, answer) VALUES
(1, 1, 5), (1, 2, 1), (1, 3, 1), (1, 4, 3), (1, 5, 1),
(2, 1, 4), (2, 2, 2), (2, 3, 3), (2, 4, 4), (2, 5, 1),
(3, 1, 5), (3, 2, 1), (3, 3, 5), (3, 4, 1), (3, 5, 3),
(4, 1, 1), (4, 2, 5), (4, 3, 3), (4, 4, 2), (4, 5, 3),
(5, 1, 4), (5, 2, 4), (5, 3, 2), (5, 4, 5), (5, 5, 2),
(6, 1, 4), (6, 2, 3), (6, 3, 2), (6, 4, 1),
(7, 1, 5), (7, 2, 5), (7, 3, 4),
(8, 1, 2), (8, 2, 2),
(9, 1, 4)
