import json
import threading
from .models import *
import random
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import time
import hashlib

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
import time

import sseclient
from rest_framework import status
import openai
import time
from chat.models import ChatContentModel
import uuid


class ChatThread(threading.Thread):
    
    def __init__(self, request):
        self.request = request
        threading.Thread.__init__(self)


    def run(self):
        try:
            channel_layer = get_channel_layer()
            i = 0
            # Simple Streaming ChatCompletion Request            
            for chunk in range(1,100):
                time.sleep(0.01)

                data = {"current_total": i, "content": "@@"+str(i)+"@@"}

                async_to_sync(channel_layer.group_send)(
                            f"chat_{self.request.data.get('chat_room','')}",{
                                # type is the function called from consumers
                                'type':'send_notification',
                                # this is the value send to send_notification function in consumer
                                'value': json.dumps(data)
                            }
                        )
                i += 1

        except Exception as e:
            print(e)