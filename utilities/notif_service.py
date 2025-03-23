import utilities.util_functions as util_functions
import asyncio
from datetime import datetime
import time
import threading
import threading
import time

def roll_service(self, patient_table_name, appointment_table_name, seconds):
    # Retrieve all data
    all_appointments = util_functions.pull_from_db(self, {}, appointment_table_name, False)
    
    for appointment in all_appointments:
        # Your appointment logic here...
        target_date = datetime(
            int(appointment['Appointment_Year']),
            int(appointment['Appointment_Month']),
            int(appointment['Appointment_Day'])
        )
        current_datetime = datetime.now()
        difference_in_days = (target_date - current_datetime).total_seconds() / 86400
        
        if 0.9 < difference_in_days < 1.1:
            patient_data = util_functions.pull_from_db(self, {'Patient_ID': appointment['Patient_ID']}, patient_table_name, False)[0]
            util_functions.sms_reminder(patient_data['PatientContactNo'], appointment['Appointment_Time'])
    
    # Schedule the next run of the function after the interval (seconds)
    print('RUNNING NOTIF SERVICE', 'Threads:',threading.active_count())
    threading.Timer(seconds, lambda: roll_service(self, patient_table_name, appointment_table_name, seconds)).start()

def start_notif_service(self, patient_table_name, appointment_table_name, seconds):
    print("Notification service started")
    # Start the recurring process
    roll_service(self, patient_table_name, appointment_table_name, seconds)

