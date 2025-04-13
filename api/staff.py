from flask import request, jsonify
from flask_cors import cross_origin
from utilities.util_functions import get_query, pull_from_db, push_to_db, update_db, delete_from_db, get_session

def staff_routes(self, table_name):
    """Define Flask routes."""

    @self.app.route('/api/staff', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def staff_pull():
        data = request.args.to_dict()
        processed_data = {}
        session = get_session("isStaff")
        if (not session):
            return jsonify({"customError": "Not Authorized."}), 200
                        
        for key, value in data.items():
            if value != 'null':
                try:
                    processed_data[key] = int(value)
                except ValueError:
                    processed_data[key] = value
        return pull_from_db(self, processed_data, table_name)
  
    @self.app.route('/api/staff', methods=['PUT'])
    def staff_update():
        data = request.json
        print("DATA",data)
        return update_db(self, data, table_name, filter_names=['staff_ID'])
"""
    @self.app.route('/api/symptomsref', methods=['POST'])
    def symptomsref_push():
        data = request.json
        return push_to_db(self, data, table_name="tblsymptomsref")
  
    @self.app.route('/api/symptomsref', methods=['DELETE'])
    def symptomsref_delete():
        data = request.json
        print(data)
        return delete_from_db(self, data, "tblsymptomsref", filter_names=['SymptomsRef_ID'])
    
"""