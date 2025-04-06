from flask import request, jsonify
from flask_cors import cross_origin
from utilities.util_functions import get_query, pull_from_db, push_to_db, update_db, delete_from_db

def symptoms_routes(self, table_name):
    """Define Flask routes."""
    @self.app.route('/api/symptomsref', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def get_symptom_references():
        data = request.args.to_dict()
        processed_data = {}
        for key, value in zip(data.keys(), data.values()):
            if value != 'null':
                try:
                    processed_data[key] = int(value)
                except ValueError as e:
                    processed_data[key] = value
        print(processed_data)
        return pull_from_db(self, processed_data, "tblsymptomsref")

    @self.app.route('/api/symptoms', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def symptoms_pull_by_patient():
        # url parameters will are used for filtering
        data = request.args.to_dict()
        processed_data = {}
        print("DATA",data)

        for key, value in zip(data.keys(), data.values()):
            if value != 'null':
                processed_data[key] = int(value)
        print(processed_data)
        return pull_from_db(self, processed_data, table_name)
    
    @self.app.route('/api/symptomsref', methods=['POST'])
    def symptomsref_push():
        """Add a new user to the database."""
        data = request.json
        return push_to_db(self, data, table_name="tblsymptomsref")
    
    @self.app.route('/api/symptoms', methods=['POST'])
    def symptoms_push():
        """Add a new user to the database."""
        data = request.json
        return push_to_db(self, data, table_name=table_name)
    
    @self.app.route('/api/symptomsref', methods=['POST'])
    def symptomsref_push():
        """Add a new user to the database."""
        data = request.json
        return push_to_db(self, data, table_name="tblsymptomsref")
       
    @self.app.route('/api/symptomsref', methods=['PUT'])
    def symptomsref_update():
        data = request.json
        print(data)
        return update_db(self, data, "tblsymptomsref", filter_names=['SymptomsRef_ID'])  
  
    
    @self.app.route('/api/symptoms', methods=['PUT'])
    def symptoms_update():
        data = request.json
        print(data)
        return update_db(self, data, table_name, filter_names=['Symptoms_ID'])
    
    @self.app.route('/api/symptomsref', methods=['DELETE'])
    def symptomsref_delete():
        data = request.json
        print(data)
        return delete_from_db(self, data, "tblsymptomsref", filter_names=['SymptomsRef_ID'])
    
    @self.app.route('/api/symptoms', methods=['DELETE'])
    def symptoms_delete():
        data = request.json
        print(data)
        return delete_from_db(self, data, table_name, filter_names = ['Appointment_ID'])
    

