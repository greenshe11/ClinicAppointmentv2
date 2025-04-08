"""from twilio.rest import Client
account_sid = 'AC85abc35b629db24f138fbc2acc2f218d'
auth_token = '52f058d2282e22e4b68ad25846abfb19'
client = Client(account_sid, auth_token)
lookup = client.lookups.v1.phone_numbers("+639709319316").fetch(type="phone number")
print(lookup.carrier)

message = client.messages.create(
  from_='+19519043577',
  body='confirmed message',
  to='+639709319316'
)
print(message.sid)"""
from __future__ import print_function
import clicksend_client
from clicksend_client import SmsMessage
from clicksend_client.rest import ApiException


# Configure HTTP basic authorization: BasicAuth
configuration = clicksend_client.Configuration()
configuration.username = ''
configuration.password = ''

# create an instance of the API class
api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))

# If you want to explictly set from, add the key _from to the message.
sms_message = SmsMessage(source="php",
                        body="isatu chatbot",
                        to="+")

sms_messages = clicksend_client.SmsMessageCollection(messages=[sms_message])

try:
    # Send sms message(s)
    api_response = api_instance.sms_send_post(sms_messages)
    print(api_response)
except ApiException as e:
    print("Exception when calling SMSApi->sms_send_post: %s\n" % e)