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
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblappointment`
--

LOCK TABLES `tblappointment` WRITE;
/*!40000 ALTER TABLE `tblappointment` DISABLE KEYS */;
INSERT INTO `tblappointment` VALUES (139,47,0,7,4,8,2025,0,'none'),(140,47,0,7,4,9,2025,0,''),(141,47,0,8,4,8,2025,0,''),(142,47,0,8,4,9,2025,0,'');
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpatient`
--

LOCK TABLES `tblpatient` WRITE;
/*!40000 ALTER TABLE `tblpatient` DISABLE KEYS */;
INSERT INTO `tblpatient` VALUES (47,NULL,'MyFirstName','MyLastName','$2b$12$oxAoMLghqbRJnE3Z4bxIbugXKy.QEHC/8axXtmp06okJq.liykCOG','email02@email','639709319316','student'),(48,NULL,'FirstName2','LastName2','$2b$12$MGYB/PF8426N1sc7iuHJ.eDD7be.OB4eyEPQbbvmOxtZD/EhGhSfK','email1@email1','639674688324','student'),(49,NULL,'email03','email03','$2b$12$jZcnVjVAKSMoKRpL6yT51uP7MSVc4UT4lJxZWwF8m/8K3NsitJyzi','email03@email','639555725130','faculty'),(50,NULL,'FirstName2','FirstName3','$2b$12$DW3HCUPQ4zfHQlsdZSRFFOJpzziYTEHksJ0Uuk/l2Odp4bNRjlKaW','email02@gmail.com','639192248798','office staff');
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
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsymptoms`
--

LOCK TABLES `tblsymptoms` WRITE;
/*!40000 ALTER TABLE `tblsymptoms` DISABLE KEYS */;
INSERT INTO `tblsymptoms` VALUES (176,'131',139),(177,'00',139),(178,'130',140),(179,'00',140),(180,'87',141),(181,'89',141),(182,'133',141),(183,'129',142);
/*!40000 ALTER TABLE `tblsymptoms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsymptomsref`
--

DROP TABLE IF EXISTS `tblsymptomsref`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblsymptomsref` (
  `SymptomsRef_ID` int NOT NULL AUTO_INCREMENT,
  `SymptomsRef_Name` varchar(100) DEFAULT NULL,
  `SymptomsRef_Level` varchar(400) DEFAULT NULL,
  `SymptomsRef_Recommendation` varchar(400) DEFAULT NULL,
  `SymptomsRef_IsMild` tinyint DEFAULT NULL,
  PRIMARY KEY (`SymptomsRef_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsymptomsref`
--

LOCK TABLES `tblsymptomsref` WRITE;
/*!40000 ALTER TABLE `tblsymptomsref` DISABLE KEYS */;
INSERT INTO `tblsymptomsref` VALUES (87,'Fever','37.8 C-39 C','Stay hydrated and rest. Use light clothing. Consider over-the-counter medication like acetaminophen or ibuprofen for discomfort',1),(88,'Fever','39 C-40 C','Stay hydrated and rest. Use light clothing. Consider over-the-counter medication like acetaminophen or ibuprofen for discomfort',1),(89,'Dengue Fever','mild','Rest, stay hydrated, and take paracetamol to reduce fever. Avoid aspirin and ibuprofen',1),(90,'Rheumatic Fever','mild','Get plenty of rest. Stay hydrated and eat nutritious meals.',1),(91,'Hay Fever','mild','Use saline nasal spray. Stay hydrated and avoid allergens',1),(92,'Headache','mild','Rest in a quiet, dark room. Use a cold compress or gentle massage.',1),(93,'Sinus Headache','mild','Use a warm compress and stay hydrated. Try steam inhalation to relieve pressure',1),(94,'Tension-Type Headache','mild','Rest in a quiet, dark room. Use a cold compress or gentle massage',1),(95,'Tension-Type Headache','severe','Stay in a cool, ventilated area and avoid strong odors',0),(96,'Fever, sweating, and shaking','mild','Use fever reducers like acetaminophen or ibuprofen if needed',1),(97,'Chills and shivering','mild','Use a warm blanket. Drink warm fluids',1),(98,'Slight fever and chills','mild','Monitor temperature; stay hydrated and rest',1),(99,'Mild muscle aches','mild','Rest, stay hydrated, and consider warm compresses',1),(100,'Loss of appetite','mild','Eat small, nutritious meals. Drink fluids like broth or juice',1),(101,'Irritability','mild','Ensure rest and hydration. Try relaxation techniques',1),(102,'General weakness','mild','Drink fluids, rest, and avoid strenuous activity',1),(103,'Mild dehydration','mild','Increase fluid intake. Drink water or oral rehydration solution',1),(104,'Mild muscle aches','mild','Rest, stay hydrated, and consider warm compresses',1),(105,'Sore throat','mild discomfort','Drink warm fluids, avoid acidic drinks, and use honey for relief',1),(106,'Mild nausea without vomiting','mild','Sip ginger tea or stay hydrated',1),(107,'Mild vomiting','mild','Take small sips of fluids and avoid solid foods temporarily',1),(108,'Dizzy or lightheaded feelings','mild','Sit or lie down immediately. Stay hydrated and avoid standing up too quickly',1),(109,'Fatigue','mild','Rest and maintain a balanced diet. Monitor hydration and salt intake',1),(110,'Trouble concentrating','mild','Take breaks, drink water, and eat small frequent meals',1),(111,'Upset stomach','mild','Eat light, bland foods and drink fluids. Avoid sudden posture changes.',1),(112,'Dull, aching head pain','mild','Rest in a quiet, dark room. Use a cold compress or gentle massage',1),(113,'Feeling of tightness or pressure a','mild','Practice relaxation techniques like deep breathing and neck stretches',1),(114,'Tenderness in the scalp, neck, anc','mild.','Apply heat packs to tense muscles and try gentle stretching exercises',1),(115,'Mild ear pain, especially when lyir','mild','Use a warm compress and over-the-counter pain relievers',1),(116,'tugging or pulling at an ear','mild','Monitor for worsening symptoms and keep the ear dry.',1),(117,'Trouble sleeping','mild','Try a comfortable sleeping position and pain relief methods',1),(118,'Crying more than usual','mild','Soothe with gentle rocking and ensure hydration.',1),(119,'Fussiness','mild','Provide comfort and monitor for fever or worsening pain.',1),(120,'Mild trouble hearing or respondin','mild.','Monitor symptoms and avoid loud noises',1),(121,'Runny nose','moderate','Use saline nasal spray. Stay hydrated',1),(122,'Cough','mild','Stay hydrated and use honey or lozenges to soothe the throat',1),(123,'Sneezing and cough','mild','Take antihistamines. Avoid allergen exposure',1),(124,'Mild diarrhea (without blood)','mild','Stay hydrated and eat bland foods like toast, bananas, or rice',1),(125,'Mild rash','mild','Keep skin cool and wear loose clothing to reduce irritation',1),(126,'Neck stiffness','mild','Apply heat or perform gentle neck stretches',1),(127,'Increased urination','mild','Ensure proper hydration and monitor for dehydration',1),(128,'Loss of appetite','mild','Offer soft foods and ensure hydration',1),(129,'Fever','greater than 40 C','Seek immediate medical attention.',0),(130,'Dengue Fever','moderate','Stay hydrated and rest in a dark, quiet room,',0),(131,'Dengue Fever','severe','Use saline nasal spray. Stay hydrated and avoid allergens',0),(132,'Rheumatic Fever','moderate','Rest and avoid physical exertion. If pain worsens, seek medical advice',0),(133,'Rheumatic Fever','severe','Seek urgent care. Could indicate nervous system involvement.',0),(134,'Hay Fever','moderate','Take antihistamines or decongestants as needed.',0),(135,'Hay Fever','severe','Consult a doctor for sinusitis evaluation',0),(136,'Headache','moderate','Try over-the-counter pain relievers like ibuprofen..',0),(137,'Headache','severe','Seek emergency care immediately',0),(138,'Sinus Headache','moderate','Try steam inhalation. Monitor symptoms and consult a doctor if prolonged',0),(139,'Sinus Headache','severe','Seek medical attention for further assessment',0),(140,'Tension-Type Headache','moderate','Try stress management techniques and over-the-counter pain relievers if necessary',0),(141,'Fever, sweating, and shaking c','moderate','Monitor and seek medical attention if persistent',0),(142,'Chills and shivering','severe','Seek urgent medical evaluation',0),(143,'Shaking and chills','severe','Seek urgent medical evaluation',0),(144,'Moderate muscle aches','moderate','Use a warm compress. Take pain relievers if necessary',0),(145,'Fatigue or weakness','moderate','Ensure proper rest and hydration',0),(146,'Fatigue or weakness','severe','Could indicate internal bleeding. Get urgent medical attention',0),(147,'Neurological symptoms','severe','Seek emergency medical care',0),(148,'Extreme weakness, fatigue, or','moderae','Consult a healthcare provider to check for underlying conditions',0),(149,'Severe dehydration (no urine,','severe','Seek emergency medical care immediately',0),(150,'Muscle weakness or loss of mc','severe','Seek immediate medical care for possible neurological effects',0),(151,'Moderate muscle aches','moderate','Use a warm compress. Take pain relievers if necessary',0),(152,'Sore throat that comes on sudo','moderate','Drink warm fluids. Gargle salt water. Take pain relievers if needed',0),(153,'Severe sore throat with difficult severe','severe','Seek urgent care for possible bacterial infection',0),(154,'Recurring sore throats','moderate','Consult a healthcare provider for underlying causes',0),(155,'Sore throat lasting more than 4','moderate','Seek medical attention for further evaluation',0),(156,'Stomachache','moderate','Avoid solid foods. Drink small sips of clear fluids',0),(157,'Vomiting','Occasional) (moderate','Drink fluids in small amounts. Avoid solid foods until vomiting stops',0),(158,'Persistent vomiting','severe','Dehydration risk is high. Seek medical attention',0),(159,'Frequent vomiting','moderate','Drink electrolyte solutions and monitor hydration levels',0),(160,'Moderate nausea with occasio','moderate','Stay hydrated and eat small meals',0),(161,'Frequent nausea or vomiting','moderate.','Monitor symptoms and seek medical advice if persistent',0),(162,'Vomiting and unable to hold do severe','severe','Get medical attention urgently to prevent dehydration',0),(163,'Vomiting blood','severe','Seek immediate medical attention as it may indicate internal bleeding',0),(164,'Ongoing vomiting with dizzines','severe','Seek urgent medical attention',0),(165,'Episodic tension-type headache la','moderate','Try stress management techniques and over-the-counter pain relievers if necessary.',0),(166,'Frequent episodic tension-type he','moderate','Keep a headache diary and consult a doctor if symptoms persist',0),(167,'Chronic tension-type headache','la (moderate','Consider professional treatment options such as physical therapy or stress management.',0),(168,'Sudden, severe headache','Thundi (severe','Seek emergency care immediately',0),(169,'Headache with fever, stiff neck,  ','severe','Seek urgent medical attention',0),(170,'Headache after a head injury','severe','Consult a doctor immediately',0),(171,'Neurological symptoms','weaknes (severe','Seek emergency medical care',0),(172,'Frequent migraines interfering wi','severe','Consider specialized treatment from a neurologist',0),(173,'Fever of 100 F','38 C) or higher (moderate','Use fever-reducing medication like acetaminophen or ibuprofen, and ensure hydration.',0),(174,'Drainage of clear or slightly cloud','moderate','Keep the ear dry and monitor for worsening discharge',0),(175,'Headache','moderate','Use a cold compress and ensure proper rest',0),(176,'Noticeable trouble hearing','moderate','Avoid exposure to loud noises and monitor changes',0),(177,'Loss of balance','moderate','Ensure a safe environment and monitor for persistent issues',0),(178,'Runny nose','moderate','Use saline nasal spray. Stay hydrated',0),(179,'Cough lasting for weeks, distur','moderate','Schedule a doctor\'s appointment to determine the cause',0),(180,'Coughing up blood','severe','Seek emergency medical care immediately',0),(181,'Persistent cough lasting sever severe','severe','Consult a doctor to rule out infections or underlying conditions',0),(182,'Cough with significant breathin severe','severe','Call emergency services for urgent evaluation',0),(183,'Chest pain when you breathe  ','moderate','Rest and take over-the-counter pain relievers. Seek medical advice if it worsens',0),(184,'Watery, nonbloody diarrhea','moderate','Stay hydrated with water, clear broths, or electrolyte solutions',0),(185,'Diarrhea or vomiting lasting mc','moderate','Consult a doctor to assess for dehydration and infections',0),(186,'Diarrhea with blood or pus','moderate','Consult a doctor immediately to check for bacterial infection',0),(188,'Listlessness','Child appears siu (moderate','Ensure hydration and rest. Monitor for worsening symptoms',0),(189,'Worsening rash','moderate','Monitor if rash spreads or changes. Keep skin cool',0),(190,'Sensitivity to light or noise','mild','Reduce screen time and stay in a dimly lit environmen',0),(191,'Severe light sensitivity','severe','Seek urgent care to rule out serious eye conditions',0),(192,'Stiff neck and pain when bendi','severe','Go to the ER immediately. Could be a sign of meningitis',0),(193,'Neck stiffness','mild','Apply heat or perform gentle neck stretches',0),(194,'Swelling in the neck or face','severe','May indicate a serious infection-go to the emergency room',0),(195,'Stiffness in the body and neck','severe','Seek urgent medical evaluation',0),(196,'Mental confusion, strange beha','severe','Call emergency services immediately',0),(197,'Severe drowsiness or confusio','severe','Call emergency services immediately',0),(198,'Post-migraine exhaustion, coní','moderate','Get adequate rest and stay hydrated',0),(199,'Pain when urinating','severe','May be a sign of infection. Seek medical consultation',0),(200,'Strong urge to urinate frequent','moderate','Drink water and consult a doctor if symptoms persist',0),(201,'Urine that appears cloudy','moderate','Stay hydrated and seek medical advice',0),(202,'Urine that is red, bright pink, or','moderate','Consult a healthcare provider immediately',0),(203,'Strong-smelling urine','moderate','Increase fluid intake and seek medical advice if the odor persists',0),(204,'Lower belly discomfort or blade','moderate','Rest and consult a doctor if pain worsens',0),(205,'Presence of ketones in the urir','severe','Seek immediate medical care as this indicates insufficient insulin levels',0),(206,'Difficulty breathing or chest pai','severe','Seek emergency care immediately',0),(207,'Mild breathing difficulties','due (moderate','Practice steam inhalation. Use antihistamines or decongestants',0),(208,'Trouble breathing along with di','severe','Seek emergency care immediately',0),(209,'Rapid, shallow breathing','severe','Call emergency services immediately',0),(210,'Rapid breathing or feeling like','moderate','Practice slow, deep breathing. Avoid enclosed spaces',0),(211,'Wheezing','whistling sound whi (moderate','Use prescribed bronchodilators and avoid lung irritants',0),(212,'Severe difficulty breathing','severe','Seek emergency medical care immediately',0),(214,'Fever','Acompanied by:\nSevere eye pain or irritation\nDirect injury to the eye\nSwelling in or around the eyes\nDischarge of blood or pus from the eyes\nDouble vision, loss of vision \nor blurred vision ','Tumar biogesic\n\nasd\n',1);
/*!40000 ALTER TABLE `tblsymptomsref` ENABLE KEYS */;
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

-- Dump completed on 2025-04-06 14:03:00
