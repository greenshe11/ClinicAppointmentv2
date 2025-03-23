from dotenv import load_dotenv
import os
import MySQLdb as Mysqldb
from flask import Flask, render_template, redirect
from flask_mysqldb import MySQL
from flask_cors import CORS
# Load environment variables from .env file

#api routes
from api.patient import patient_routes
from api.appointments import appointment_routes
from api.diagnosis import diagnosis_routes
from api.sms import sms_routes
from api.session import session_routes
from api.symptoms import symptoms_routes

# utils
from utilities import util_functions as util
from utilities import notif_service as notif
import asyncio

load_dotenv()

class App:
    def __init__(self):
        """Initializations"""

        self.app = Flask(__name__)
        CORS(self.app, support_credentials=True)
        self.configure_app()
        self.mysql = MySQL(self.app)
        self.create_api_routes()
        self.create_page_routes()
        self.initiate_notif_service()
    
    def initiate_notif_service(self):
        # get data every 8 hours
        notif.start_notif_service(self, 'tblpatient', 'tblappointment', 8 * 60 * 60) # attempt notif every 8 hours
        pass

    def configure_app(self):
        """Configure Flask app with MySQL settings."""
        self.app.config['SECRET_KEY'] = os.getenv('SESSION_SECRET') 
        self.app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
        self.app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
        self.app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
        self.app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
        #self.app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT')) 

    def connect_db(self):
        """Create a MySQL database connection."""

        return Mysqldb.connect(
            host=self.app.config['MYSQL_HOST'],
            user=self.app.config['MYSQL_USER'],
            password=self.app.config['MYSQL_PASSWORD'],
            db=self.app.config['MYSQL_DB'],
            #port=self.app.config['MYSQL_PORT'] 
        )
    
    def create_page_routes(self):
        @self.app.route('/') # base url page
        def home():
            """Go to login page by default"""
            try: 
                return render_template('index.html')
            except Exception as e:
                return f"Error: {e}", 500
        
        @self.app.route('/login')
        def patient_login(): #login page
            """Go to Home if logged in else go to login.html"""
            if not util.no_user_logged_in():
                print("NO USER LOGGED IN")
                return redirect('/')
            try:
                return render_template('login.html') #kas?
            except Exception as e:
                return f"Error: {e}", 500

        @self.app.route('/register')
        def patient_register():  # registration page
            if not util.no_user_logged_in(): # proceeds to home if logged in
                return redirect('/')
            try:
                return render_template('register.html')
            except Exception as e:
                return f"Error: {e}", 500
           
        @self.app.route('/home')
        def patient_home():
            if util.no_user_logged_in(): #proceeds to login page if not logged in
                return redirect('/login')
            try:
                if util.user_is_staff():
                    print("USER IS STAFF")
                    return redirect('/staff')
                return render_template('patient/main.html')
                
            except Exception as e:
                return f"Error: {e}", 500
            
        @self.app.route('/profile')
        def profile_user():
            if util.no_user_logged_in():#proceeds to schedule page if not logged in
                return redirect('/login')
            if util.user_is_staff():
                return render_template('staff/profileAdmin.html') 
            try:
                return render_template('patient/profile.html')
            except Exception as e:
                return f"Error: {e}", 500
            
        @self.app.route('/schedule')
        def schedule_home():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/schedule.html')
            except Exception as e:
                return f"Error: {e}", 500
        
        @self.app.route('/chatbotpage')
        def chatbotpage():
            if util.no_user_logged_in(): #proceeds to schedule page if not logged in
                return redirect('/login')
            if util.user_is_staff():
                return redirect('/profile')
            try:
                return render_template('patient/chatbot.html')
            except Exception as e:
                return f"Error: {e}", 500
        '''
        @self.app.route('/chatbotpage/response')
        def chatbotpageResponse():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/chatbotpageResponse.html')
            except Exception as e:
                return f"Error: {e}", 500
            
        @self.app.route('/chatbotpage/response/appointment')
        def chatbotpageAppointment():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/chatbotpageAppointment.html')
            except Exception as e:
                return f"Error: {e}", 500
            
        @self.app.route('/chatbotpage/response/appointment/summary')
        def chatbotpageSummary():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/chatbotpageSummary.html')
            except Exception as e:
                return f"Error: {e}", 500'''
            
        @self.app.route('/about')
        def about_home():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/about.html')
            except Exception as e:
                return f"Error: {e}", 500

        @self.app.route('/staff')
        def staff_home():
            if util.no_user_logged_in() or not util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('staff/mainstaff.html')
            except Exception as e:
                return f"Error: {e}", 500
            
        
        @self.app.route('/staff/schedules')
        def staff_schedules():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('dummy_all_appointments.html')
            except Exception as e:
                return f"Error: {e}", 500
        
        @self.app.route('/chat')
        def chatbot():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/chatbot.html')
            except Exception as e:
                return f"Error: {e}", 500
            
        @self.app.route('/chatbotpage/success')
        def chatbotpageSuccess():
            if util.no_user_logged_in() or util.user_is_staff(): #proceeds to schedule page if not logged in
                return redirect('/home')
            try:
                return render_template('patient/appointmentSent.html')
            except Exception as e:
                return f"Error: {e}", 500
            
    def create_api_routes(self):
        patient_routes(self, 'tblpatient')
        appointment_routes(self, 'tblappointment')
        diagnosis_routes(self, 'tbldiagnosis')
        sms_routes(self, 'tblsmsnotif')
        session_routes(self)
        symptoms_routes(self, 'tblsymptoms')

    def run(self):
        """Run the Flask application."""
        self.app.run(debug=True)

if __name__ == '__main__':
    app_instance = App()
    app_instance.run()