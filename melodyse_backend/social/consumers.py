import json
from channels.generic.websocket import  WebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from users.models import Message, Chat, User, Notification
from asgiref.sync import async_to_sync

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        print('gtooooo' + str(self.scope['user'].id))
        self.group_name = str(self.scope['user'].id)

        # Join group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()
        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message':'You are now connected!'
        }))

    def new_notf(self, event):
        count = event['count']

        self.send(text_data=json.dumps({
            'type': 'new_notf',
            'count': count
        }))
