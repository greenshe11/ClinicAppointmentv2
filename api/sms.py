from flask import request, jsonify, session
from flask_cors import cross_origin
from utilities.util_functions import pull_from_db, sms_otp, push_to_db, update_db, delete_from_db, sms_confirmed, sms_reject, sms_resched, sms_after_registration, sms_registration_confirmation
import utilities.util_functions as utils

def sms_routes(self, table_name):
    
    """Define Flask routes."""
    @self.app.route('/api/sms', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def sms_send():
        # url parameters will are used for filtering
        data = request.json
        purposes = {
            1: sms_confirmed,
            2: sms_reject,
            3: sms_resched,
        }
        print("SENDING SMS", data, data['statusCode'])
        purposes[data['statusCode']](date=data['date'], time=data['time'], contact=data['contact'], fullname=data['fullname'])
        return jsonify({'success': True})

    @self.app.route('/api/sms/registration', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def sms_send_registration():
        # url parameters will are used for filtering
        data = request.json
        staffData = pull_from_db(self, {"staffIsAdmin":1}, 'tblstaff',jsonify_return=False)[0]
        print("STAFF DATA", staffData)
        if (staffData["staffAutoConfirm"]==0):
            sms_after_registration(contact=data['contact'], fullname=data['fullname'])
        return jsonify({'success': True})
    
    @self.app.route('/api/sms/otp', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def sms_send_otp():
        # url parameters will are used for filtering
        data = request.json
        
        sms_otp(contact=data['contact'], otp=data['otp'])
        return jsonify({'success': True})
    
    @self.app.route('/api/sms/registration/confirmed', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def sms_send_registration_confirmed():
        # url parameters will are used for filtering
        data = request.json
        sms_registration_confirmation(contact=data['contact'], fullname=data['fullname'])
        return jsonify({'success': True})