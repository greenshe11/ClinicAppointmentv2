from flask import request, jsonify
from flask_cors import cross_origin
from utilities.util_functions import pull_from_db, push_to_db, update_db, delete_from_db, remove_sessions, hashPassword, get_session, set_session, check_password

def patient_routes(self, table_name):
    """Define Flask routes."""

    @self.app.route('/api/patient', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def patient_pull():
        # example: http://localhost:5000/api/patient?Patient_ID=10
        # url parameters will are used for filtering
        data = request.args.to_dict()
        processed_data = {}

        arguments = data
        # having parameter: "for" will have special processes
        if 'for' in arguments.keys():
            if arguments['for'] == 'session':
                processed_data = {'Patient_ID': get_session('userId')}
        else:
            # remove null arguments
            for key, value in zip(data.keys(), data.values()):
                if value != 'null':
                    try:
                        processed_data[key] = int(value)
                    except Exception as e:
                        processed_data[key] = value

        print(processed_data)
        res = []
        data = pull_from_db(self, processed_data, table_name, jsonify_return=False)
        for x in data:
            temp = x
            x.pop('PatientPassword')
            res.append(temp)
        return jsonify(res)
    
    @self.app.route('/api/patient', methods=['POST'])
    def patient_push():
        """Add a new user to the database."""
        data = request.json

       
        arguments = request.args.to_dict()

        # having parameter: "for", will give special cases
        if "for" in arguments.keys():
            if arguments['for'] == 'registration':
                # For security purpose, encrypts password sent to database
                data["PatientPassword"] = hashPassword(data["PatientPassword"])
                duplicates = pull_from_db(self, {"PatientEmail": data['PatientEmail'], 
                                                 "PatientContactNo": data["PatientContactNo"]}, 
                                                 table_name, jsonify_return=False, 
                                                 logical_op="OR")
                print(duplicates)
                if len(duplicates) > 0:
                    return jsonify({"customError": "Contact No. or Email is in use!"}), 200
        
            if arguments['for'] == 'login':
                # retrieves record from database in patient table having the specified patient email
                # pull from db is imported from utilities/util_functions.py 
                credentials = pull_from_db(self, {"PatientEmail": data['PatientEmail']}, table_name, jsonify_return=False)
                
                if len(credentials) == 0: # if no record found in patient table go, search in staff table
                    # retrieve record from database in staff table having the specificed patient email
                    credentials = pull_from_db(self, {"staffEmail": data['PatientEmail']}, "tblstaff", jsonify_return=False)
                    
                    print("CRED", credentials)
                    if len(credentials) == 0:
                        return jsonify({"customError": "Password or Email is incorrect!"}), 200
 
                    correct_password = (data['PatientPassword'] == credentials[0]['staffPassword']) # staff password is not encrypted
                    is_staff = True
                else:  # if theres a record
                    correct_password = check_password(data["PatientPassword"], credentials[0]["PatientPassword"])
                    is_staff = False
                    if (correct_password):
                        print("CREDENTIALS", credentials[0])
                        if (credentials[0]["PatientIsConfirmed"]!=1):
                            return jsonify({"customError": "Cannot Login. Please wait for a nurse to confirm your registration. You will be notified via SMS once login becomes available."}), 200
                        
                    
                if correct_password:
                    set_session('isStaff', is_staff) # set session with key isStaff to is_staff (true/false)
                    if is_staff:
                        set_session('userId', credentials[0]['staff_ID']) # from data retrieved get data from column: staff_id if from staff
                    else:
                        set_session('userId', credentials[0]['Patient_ID']) # from data retrieved, get data from column: patient_ID if not staff
                    
                    # logging in doesnt require to add data to database atm; returns back to the client immediately without error
                    # all good as long as session has been set
                    return jsonify({})
                else:
                    return jsonify({"customError": "Password or Email is incorrect!"}), 200
                
            if arguments['for'] == 'logout':
                # logging out doesnt require to add data to database atm; returns back to the client immediately without error
                # all good as long as session has been removed
                remove_sessions()
                return jsonify({}), 201
                
        staffData = pull_from_db(self, {}, 'tblstaff',jsonify_return=False)[0]
        print("STAFF DATA", staffData)
        if (staffData["staffAutoConfirm"]==1):
            data["PatientIsConfirmed"] = "1"
        return push_to_db(self, data, table_name=table_name)

    @self.app.route('/api/patient', methods=['PUT'])
    def patient_update():
        # data = request.json
        # print(data)
        # return update_db(self, data, table_name, filter_names=['Patient_ID'])
        data = request.json
        print(data)
        # Assuming `update_db` is a function that updates data in the database
        return update_db(self, data, table_name=table_name, filter_names=['Patient_ID'])
    
    @self.app.route('/api/patient', methods=['DELETE'])
    def patient_delete():
        data = request.json
        print(data)
        return delete_from_db(self, data, table_name, filter_names = ['Patient_ID'])
    
