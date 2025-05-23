from flask import jsonify, session
import bcrypt
from datetime import datetime
import http.client
import json

def get_query(cursor, table_name, data, method, filter_names=[],logical_op="AND"):
    """
        optional:
            filter_names (string []): to be used for PUT and DELETE methods. 
                the query will use the values from data passed as filter values for filter_names for filtering purposes,
                and will exclude them to selected/target columns.

                for the case of GET, it will count the whole data as filter. Thus, will count as target columns.
            logical_op (string): to be used for PUT, DELETE, and GET methods.
                can be AND or OR. Logical operator to be used for filtering.
    """

    # Class for easy access of values
    class Query:
        def __init__(self, statement, values):
            self.statement = statement
            self.values = values

    # gets the column names from table name
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 1") 
    column_names = [description[0] for description in cursor.description]

    # values and placeholders
    columns_selected = []
    filter_columns = []
    filter_values = []
    values = []

    # distributes data to its corresponding types above
    for colname in column_names:
        for data_key in data.keys():
            if colname == data_key: # only takes data/keys that are found in database columns
                if colname in filter_names: # distributes data as filter
                    filter_columns.append(colname)
                    filter_values.append(data[colname])
                else: # distributes data as target columns
                    columns_selected.append(colname)
                    values.append(data[colname])

    
    # storing WHERE statement to this variable for shortening
    insert_filter = f' {logical_op} '.join(['{} = %s'.format(name) for name in filter_columns])


    # make statements using correct sql syntax based on request method
    if method.upper() == "GET":
        statement = f"SELECT * FROM {table_name} {'WHERE' if len(data) else ''} {f' {logical_op} '.join(['{} = %s'.format(name) for name in columns_selected])}"
        print(statement)

    elif method.upper() == "POST":
        statement = f"INSERT INTO {table_name} ({', '.join(columns_selected)}) VALUES ({', '.join('%s' for x in range(len(columns_selected)))})"

    elif method.upper() == "PUT":
        statement = f"UPDATE {table_name} SET {', '.join(['{} = %s'.format(name) for name in columns_selected])} WHERE {insert_filter}"
        for x in filter_values: # with the current values, filter values at the end
            values.append(x) 

    elif method.upper() == "DELETE":
        statement = f"DELETE FROM {table_name} WHERE {insert_filter}"
        values = filter_values # delet method doesnt use values. for this case, filter values will be the only values passed.

    values = tuple(values)

    return Query(statement, values)

def pull_from_db(self, data, table_name, jsonify_return=True, logical_op="AND"):
    try:
        conn = self.connect_db()
        cursor = conn.cursor()
        query = get_query(cursor=cursor,
                            table_name=table_name,
                            data=data,
                            method='get',
                            logical_op=logical_op)
        print(query.statement, query.values)
        cursor.execute(query.statement, query.values)
        
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
        result = []
        for row in rows:
            result.append(dict(zip(column_names, row)))
        #print("pulled_from_db: ", result)
        if jsonify_return == False:
            return result
        return jsonify(result), 200
   
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def push_to_db(self, data, table_name, success_response = None, jsonify_return=True):
    if success_response is None:
        success_response =  {"message": f'New instance is added to {table_name}!'}
    try:
        conn = self.connect_db()
        cursor = conn.cursor()
        query = get_query(cursor, table_name, data, 'post')

        # Insert new user into the database
        cursor.execute(query.statement, query.values)
        row = cursor.lastrowid

        conn.commit()
        if jsonify_return == False:
            return success_response
        success_response['id'] = row
        return jsonify(success_response), 201
   
    except Exception as e:
        conn.rollback()  # Rollback transaction on error
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


def update_db(self, data, table_name, filter_names, success_response = None):
    if success_response is None:
        success_response = {"message": f'An instance from {table_name} is updated!'}
    conn = self.connect_db()
    cursor = conn.cursor()
    try:
        # Update user information
        query = get_query(cursor, table_name, data, method = 'put', filter_names = filter_names)
        cursor.execute(
            query.statement,
            query.values
        )

        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify(success_response), 200
   

    except Exception as e:
        conn.rollback()  # Rollback transaction on error
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def delete_from_db(self, data, table_name, filter_names, success_response = None):
    if success_response is None:
        success_response = {"message": 'An instance from {table_name} is deleted!'}
    try:
        conn = self.connect_db()
        cursor = conn.cursor()
        query = get_query(cursor, table_name, data, method='delete', filter_names=filter_names)
        # Delete user from the database
        cursor.execute(
            query.statement, 
            query.values
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User deleted successfully"}), 200
   
    except Exception as e:
        conn.rollback()  # Rollback transaction on error
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def hashPassword(text):
    # The password you want to hash
    password = text

    # Generate a salt
    salt = bcrypt.gensalt()

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Convert hashed_password to a string (optional)
    hashed_password = hashed_password.decode('utf-8')

    #print("Hashed password:", hashed_password)
    return hashed_password

def set_session(label: str, value):
    """_summary_

    Args:
        label (str): session name
        value (any): value of session
    """
    session[label] = value

def get_session(label):
    """gets session value

    Args:
        label (str): session name

    Returns:
        returns anything inside session
    """
    if label in dict(session).keys():
        return dict(session)[label]
    else:
        return None

def remove_sessions(labels = []):
    """Removes sessions. Don't specify labels to remove all session names.

    Args:
        labels (list, optional): session names to delete. Defaults to [].
    """

    if len(labels) == 0:
        session.clear()
        return
    for label in labels:
        session.pop(label, None)

def no_user_logged_in():
    """checks if a user is authenticated

    Returns:
        bool: true or false
    """
    if get_session("userId") is None:
        return True
    return False

def check_password(plain_password, hashed_password):
    # Convert the plain password to bytes, as bcrypt requires byte strings
    
    plain_password_bytes = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    
    # Check if the plain password matches the hashed password
    is_match = bcrypt.checkpw(plain_password_bytes, hashed_password)
    
    return is_match



def parse_date(month: int, day:int, year:int, time:int, **kwargs):
    month_str = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
    ]
    get_time_postfix = lambda time: 'PM' if time < 8 else 'AM'
    res = '{} {} {} {}:00 {}'.format(month_str[month-1], day, year, time, get_time_postfix(time))

    return datetime.strptime(res, "%B %d %Y %I:%M %p")


def sort_dates(patients):

    """    ex.
    patients = [
        {"PatientLastName": "Smith", "PatientName": "John", "month": 3, "day": 14, "year": 2023, "time": 8},
        {"PatientLastName": "Doe", "PatientName": "Jane", "month": 1, "day": 1, "year": 2024, "time": 10},
        {"PatientLastName": "Brown", "PatientName": "Charlie", "month": 12, "day": 25, "year": 2023, "time": 9},
    ]"""

    # Sort the list of dates using the parsed datetime objects
    
    sorted_dates = sorted(patients, reverse=True, key=lambda x: parse_date(**x))
    return sorted_dates


def user_is_staff():
    return get_session('isStaff')

def user_is_admin():
    return get_session('isAdmin')
import requests
from twilio.rest import Client
from dotenv import load_dotenv
import os
load_dotenv()
import clicksend_client
from clicksend_client import SmsMessage
from clicksend_client.rest import ApiException

# Configure HTTP basic authorization: BasicAuth
configuration = clicksend_client.Configuration()
configuration.username = os.getenv('CLICKSEND_USERNAME')
configuration.password = os.getenv('CLICKSEND_SECRET') 
print("INFO", configuration.username, configuration.password)
# create an instance of the API class
api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))

def send_message(contact, message):
    print("MESSAGE SENT", message)
    # If you want to explictly set from, add the key _from to the message.
    
    sms_message = SmsMessage(source="php",
                            body=message,
                            to="+"+contact)
    sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])
    try:
        # Send sms message(s)
        api_response = api_instance.sms_send_post(sms_messages)
        print(api_response)
    except ApiException as e:
        print("Exception when calling SMSApi->sms_send_post: %s\n" % e)
    return True

def sms_otp(contact, otp):
    send_message(contact, f"""ISAT-U Med Clinic
Your OTP is {otp}.""")
    
def sms_after_registration(contact, fullname, *args, **kwargs):
    send_message(contact, f"""Hello {fullname}! your account is being verified. Please wait before logging in. – ISAT-U Medical Clinic, Burgos St., La Paz, Iloilo City.
""")

def sms_registration_confirmation(contact, fullname, *args, **kwargs):
    send_message(contact, f"""Hello {fullname}, your registration is confirmed. You may now log in. – ISAT-U Medical Clinic, Burgos St., La Paz, Iloilo City.""")

def sms_confirmed(date, time, contact, fullname, *args, **kwargs):
    print("CONFIRMATION SMS SENT", date, time, contact)
    #send_message(contact, f"Your appointment has been confirmed for {date}, {time}")
    send_message(contact, f"""Name: {fullname} | {date} {time} | ISAT-U Med Clinic (Old Site), Burgos St, La Paz, Iloilo City. Arrive 10 mins early with ID.""")
    return True
    url = "https://api.movider.co/v1/sms"

    payload = {
        "api_secret": "KrqFHVwqmJ6OS8ppqk_hcTHZmbdgCF",
        "api_key": "2v7fbmACO0LjcOZqWsl4zLchjAe",
        "to": contact,
        "text":  f"Your appointment has been confirmed for {date}, {time}"
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.text)
    return True

def sms_reject(contact, *args, **kwargs):
    print("REJECT SMS SENT", contact)
    send_message(contact, f"Your appointment has been rejected")
    return True
    url = "https://api.movider.co/v1/sms"

    payload = {
        "api_secret": "KrqFHVwqmJ6OS8ppqk_hcTHZmbdgCF",
        "api_key": "2v7fbmACO0LjcOZqWsl4zLchjAe",
        "to": contact,
        "text":  f"Your appointment has been rejected"
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.text)
    return True
    
def sms_resched(date, time, contact, *args, **kwargs):
    print("Rescheduling SMS SENT", date, time, contact)
    send_message(contact,  f"Your appointment has been rescheduled to {date}, {time}.")
    return True
    url = "https://api.movider.co/v1/sms"

    payload = {
        "api_secret": "KrqFHVwqmJ6OS8ppqk_hcTHZmbdgCF",
        "api_key": "2v7fbmACO0LjcOZqWsl4zLchjAe",
        "to": contact,
        "text": f"Your appointment has been rescheduled to {date}, {time}."
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.text)
  
    return True

def sms_reminder(contact,time):
    print("REMINDER SMS SENT", contact)
    timeName = lambda number: "PM" if number < 5 else "AM"
    message = f"Good Day! This is an automated message from ISATU Chatbot Clinic and we would like to remind you that your appointment is in tommorow at {time} {timeName(time)}. Thank you."
    print(message)
    send_message(contact, message)
    return True
    payload = json.dumps({
        "messages": [
            {
                "destinations": [{"to":contact}],
                "from": "447491163443",
                "text": message
            }
        ]
    })
    url = "https://api.movider.co/v1/sms"

    payload = {
        "api_secret": "KrqFHVwqmJ6OS8ppqk_hcTHZmbdgCF",
        "api_key": "2v7fbmACO0LjcOZqWsl4zLchjAe",
        "to": contact,
        "text":message
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    }

    response = requests.post(url, data=payload, headers=headers)

    print(response.text)
  
    return True