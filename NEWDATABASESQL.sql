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
-- Table structure for table `tblappointment`
--

DROP TABLE IF EXISTS `tblappointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblappointment` (
  `Appointment_ID` int NOT NULL AUTO_INCREMENT,
  `Patient_ID` int NOT NULL,
  `Smsnotif_ID` int NOT NULL,
  `Appointment_Day` int NOT NULL,
  `Appointment_Month` int NOT NULL,
  `Appointment_Time` int NOT NULL,
  `Appointment_Year` int NOT NULL,
  `Appointment_Confirmed` int NOT NULL DEFAULT '0',
  `Appointment_Complaints` varchar(255) NOT NULL DEFAULT 'none',
  PRIMARY KEY (`Appointment_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblappointment`
--

LOCK TABLES `tblappointment` WRITE;
/*!40000 ALTER TABLE `tblappointment` DISABLE KEYS */;
INSERT INTO `tblappointment` VALUES (72,41,0,14,10,9,2024,1,'none'),(73,41,0,14,10,10,2024,1,'none'),(74,41,0,24,10,8,2024,1,'none'),(76,41,0,22,11,8,2024,0,'none');
/*!40000 ALTER TABLE `tblappointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblpatient`
--

DROP TABLE IF EXISTS `tblpatient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblpatient` (
  `Patient_ID` int NOT NULL AUTO_INCREMENT,
  `PatientCode` varchar(100) DEFAULT NULL,
  `PatientName` varchar(100) NOT NULL,
  `PatientLastName` varchar(100) NOT NULL,
  `PatientPassword` varchar(100) NOT NULL,
  `PatientEmail` varchar(100) NOT NULL,
  `PatientContactNo` varchar(100) NOT NULL,
  `PatientCategory` varchar(45) NOT NULL DEFAULT 'student',
  PRIMARY KEY (`Patient_ID`),
  UNIQUE KEY `PatientContactNo_UNIQUE` (`PatientContactNo`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpatient`
--

LOCK TABLES `tblpatient` WRITE;
/*!40000 ALTER TABLE `tblpatient` DISABLE KEYS */;
INSERT INTO `tblpatient` VALUES (41,NULL,'MyFirstName','MyLastName','$2b$12$ZdKBlcy66yyKYuLjzOcxpud6fwc6x7A3yUCtcZ87Arqnz0sz.FYAW','email02@email','639111111111','faculty'),(42,NULL,'hello','world','$2b$12$qkLOyXuguHa1Wt/dsUDTKunvyPFwOIL7XyWvO0f57/3PJRnABFOwa','','+639674688324','student'),(43,NULL,'eugene','dave','$2b$12$BzXZ6n74E63xB.OUyR0qjOb/mXyb4HUjXUGXvnM.72EuX6llkpn6W','eugene','639672312312','student'),(44,NULL,'eugene dave','tumagan','$2b$12$YsDeQpzpePPqx9rMbhnb9.RDoO7.e8R6ebuoIE6bsJIk19yj13mwy','dave','639513213123','student'),(45,NULL,'asda','asdasd','$2b$12$tXD6eE.if/43MeLaAbJfyezKAhgT2/XYMTT74bqV8RgKTh7G8VH1.','euge@gmail.com','6313123','student'),(46,NULL,'First Name','Last Name','$2b$12$k46QpslopdN0UvilOD/pYON4hkIuv2Wp/QtjSl46sq0Ea/UcWTUy.','email@email.com','639674688324','student');
/*!40000 ALTER TABLE `tblpatient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstaff`
--

DROP TABLE IF EXISTS `tblstaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblstaff` (
  `staff_ID` int NOT NULL,
  `staffEmail` varchar(45) NOT NULL,
  `staffPassword` varchar(1080) NOT NULL,
  UNIQUE KEY `staffEmail_UNIQUE` (`staffEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstaff`
--

LOCK TABLES `tblstaff` WRITE;
/*!40000 ALTER TABLE `tblstaff` DISABLE KEYS */;
INSERT INTO `tblstaff` VALUES (1,'staff@staff','staff');
/*!40000 ALTER TABLE `tblstaff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsymptoms`
--

DROP TABLE IF EXISTS `tblsymptoms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblsymptoms` (
  `Symptoms_ID` int NOT NULL AUTO_INCREMENT,
  `Symptoms_Code` varchar(255) NOT NULL,
  `Appointment_ID` int NOT NULL,
  PRIMARY KEY (`Symptoms_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsymptoms`
--

LOCK TABLES `tblsymptoms` WRITE;
/*!40000 ALTER TABLE `tblsymptoms` DISABLE KEYS */;
INSERT INTO `tblsymptoms` VALUES (32,'o',72),(33,'b15',72),(34,'b9',72),(35,'o',73),(36,'a1',73),(37,'o',74),(38,'a1',74),(42,'a3',76),(43,'o',76),(44,'a0',76);
/*!40000 ALTER TABLE `tblsymptoms` ENABLE KEYS */;
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

-- Dump completed on 2024-11-24 22:19:28
