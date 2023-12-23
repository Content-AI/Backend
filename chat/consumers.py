from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ChatClass(AsyncJsonWebsocketConsumer):
    async def connect(self, *args,**kwargs):

        self.room_name = self.scope['url_route']['kwargs']['room_uuid']
        self.room_group_name = f"chat_{self.scope['url_route']['kwargs']['room_uuid']}"

        await(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({'content': 'connected to new channel'}))

    async def receive(self,text_data):
        await self.send(text_data=json.dumps({'content': 'new channel got message'}))

    async def disconnect(self, *args,**kwargs):
        print("disconnected from first")

    async def send_notification(self,event):
        date = json.loads(event.get('value'))
        await self.send(text_data=json.dumps(date))
