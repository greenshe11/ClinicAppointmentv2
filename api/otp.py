from flask import request, jsonify, session
from flask_cors import cross_origin
from utilities.util_functions import hashPassword, pull_from_db, sms_otp, push_to_db, update_db, delete_from_db, sms_confirmed, sms_reject, sms_resched, sms_after_registration, sms_registration_confirmation
import utilities.util_functions as utils
import random
import string
def otp_routes(self, table_name):
    
    """Define Flask routes."""
    @self.app.route('/api/otp_compare', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def otp_compare():
        # url parameters will are used for filtering
        data = request.json
        otp_input = data["otp"]
        otp_contact = data["contact"]
        print("OTP", otp_input, "CONTACT", otp_contact)
        otp_data = pull_from_db(self, {}, table_name, jsonify_return=False)
        for data in otp_data:
            if data["Otp_Contact"] == otp_contact:
                if data["Otp_Code"] ==  otp_input:
                    return jsonify({'success': True})
        return jsonify({'success': False})
    
    """Define Flask routes."""
    @self.app.route('/api/otp_create', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def otp_create():
        # url parameters will are used for filtering
        data = request.json
        otp_contact = data["contact"]
        otp_data = pull_from_db(self, {"Otp_Contact": otp_contact}, table_name, jsonify_return=False)
        target_user = pull_from_db(self, {"PatientContactNo": otp_contact}, "tblpatient", jsonify_return=False)[0]
        print("EXISTING",otp_data)
        if (len(otp_data)>0):
            new_otp = ''.join(random.choices(string.digits, k=5))
            print("NEW OTP", new_otp)
            otp_data[0]["Otp_Code"] = new_otp
            print(otp_data[0])
            
            update_db(self, otp_data[0], table_name, filter_names=["Otp_ID"])
            sms_otp(contact=otp_contact, otp=new_otp)
        else:
            new_otp =  ''.join(random.choices(string.digits, k=5))
            push_to_db(self, {"Otp_Code": new_otp, "Otp_Contact": otp_contact}, table_name)
            sms_otp(contact=otp_contact, otp=new_otp)
        return jsonify({'success': True,"email": target_user["PatientUsername"]})

    """Define Flask routes."""    
    @self.app.route('/api/otp_reset', methods=['POST'])
    @cross_origin(supports_credentials=True)
    def otp_reset_password():
        # url parameters will are used for filtering
        data = request.json
        otp_input = data["otp"]
        otp_contact = data["contact"]
        otp_new_password = data["password"]
        print("OTP", otp_input, "CONTACT", otp_contact)
        otp_data = pull_from_db(self, {}, table_name, jsonify_return=False)
        proceed_to_reset = False
        for data in otp_data:
            if data["Otp_Contact"] == otp_contact:
                if data["Otp_Code"] ==  otp_input:
                    proceed_to_reset = True
                    break
        if proceed_to_reset:
            target_user = pull_from_db(self, {"PatientContactNo": otp_contact}, "tblpatient", jsonify_return=False)[0]
            print("target user", target_user, otp_new_password)
            target_user["PatientPassword"] = hashPassword(otp_new_password)
            update_db(self, target_user, "tblpatient", filter_names=["Patient_ID"])
            return jsonify({"success": True, "email": target_user["PatientUsername"]})
        return jsonify({'success': False})
        
