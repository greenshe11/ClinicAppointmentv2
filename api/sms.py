from flask import request, jsonify, session
from flask_cors import cross_origin
from utilities.util_functions import pull_from_db, push_to_db, update_db, delete_from_db, sms_confirmed, sms_reject, sms_resched
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
            3: sms_resched
        }
        print("SENDING SMS", data, data['statusCode'])
        purposes[data['statusCode']](date=data['date'], time=data['time'], contact=data['contact'])
    
        return jsonify({'success': True})