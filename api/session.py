from flask import request, jsonify, session
from flask_cors import cross_origin
import utilities.util_functions as utils

def session_routes(self):
    """Define Flask routes."""

    @self.app.route('/api/session/getAppointmentDate', methods=['GET'])
    def get_session_appointment_date():
        """Add a new user to the database."""
        res = {}
        for id in ['month','day','year','time','timeName', 'monthName']:
            print(res) 
            res[id] = utils.get_session(f'appointment_{id}')
        return jsonify(res)

    @self.app.route('/api/session/storeAppointmentDate', methods=['GET'])
    def set_session_appointment_date():  
        data = request.args.to_dict()
        
        for id in ['month', 'day', 'year', 'time','timeName','monthName']:
            utils.set_session(f'appointment_{id}',data[id])
        return jsonify({"success": True})
    
    @self.app.route('/api/session/add', methods=['GET'])
    def add_data_to_session():  
        data = request.args.to_dict()
        
        for id in data.keys():
            utils.set_session(f'{id}',data[id])
        return jsonify({"success": True})
    
    @self.app.route('/api/session/storeSymptomsSelected', methods=['POST'])
    def set_session_symptoms_selected():  
        data = request.json
        utils.set_session('symptoms_selected',data['symptoms'])
        utils.set_session('symptoms_selected_code', data['code'])
        print(session)
        return jsonify({"success": True})
    
    @self.app.route('/api/session/getSymptomsSelected', methods=['GET'])
    def get_session_symptoms_date():  
        res = {}
        for id in ['symptoms_selected']:
            print(res) 
            res[id] = utils.get_session(f'{id}')
        return jsonify(res)
    
    @self.app.route('/api/session', methods=['GET'])
    def get_session_data():  
        return jsonify(dict(session))
    
    @self.app.route('/api/session/storeSymptomsResponse', methods=['POST'])
    def set_session_symptoms_response():  
        data = request.json
        utils.set_session('symptoms_response',data['response'])
        print(session)
        return jsonify({"success": True})
