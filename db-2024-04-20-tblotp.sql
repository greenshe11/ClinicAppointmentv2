CREATE DATABASE  IF NOT EXISTS `dbchatbotclinicsys` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbchatbotclinicsys`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbchatbotclinicsys
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblotp`
--

DROP TABLE IF EXISTS `tblotp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblotp` (
  `Otp_ID` int NOT NULL AUTO_INCREMENT,
  `Otp_Code` varchar(45) DEFAULT NULL,
  `Otp_Contact` varchar(45) NOT NULL,
  PRIMARY KEY (`Otp_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblotp`
--

LOCK TABLES `tblotp` WRITE;
/*!40000 ALTER TABLE `tblotp` DISABLE KEYS */;
INSERT INTO `tblotp` VALUES (3,'16784','63'),(4,'32323','631212312312'),(5,'20163','639674688324'),(6,'54919','639674688424'),(7,'86673','631231231231'),(8,'36702','636396746883'),(9,'29039','639999999999');
/*!40000 ALTER TABLE `tblotp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dbchatbotclinicsys'
--

--
-- Dumping routines for database 'dbchatbotclinicsys'
--
/*!50003 DROP PROCEDURE IF EXISTS `insert_patient` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_patient`(
    IN p_patientName VARCHAR(100),
    IN p_patientLastName VARCHAR(100),
    IN p_patientUserName VARCHAR(100),
    IN p_patientPassword VARCHAR(100),
    IN p_PatientEmail VARCHAR(100),
    IN p_PatientContactNo VARCHAR(100)


)
BEGIN
    DECLARE last_id INT;

    -- Insert the new product and get the last insert ID
    INSERT INTO tblpatient (PatientName, PatientLastName, PatientUserName, PatientPassword, PatientEmail, PatientContactNo)
    VALUES (p_patientName, p_patientLastName, p_patientUserName, p_patientPassword, p_PatientEmail, p_PatientContactNo);
    SET last_id = LAST_INSERT_ID();

    -- Update the product_code with the product_id
    UPDATE tblpatient
    SET PatientCode = CONCAT('P-', last_id)
    WHERE Patient_ID = last_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-20 15:53:17
