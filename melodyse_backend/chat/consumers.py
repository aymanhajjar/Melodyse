import json
from channels.generic.websocket import  WebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from users.models import Message, Chat
from asgiref.sync import async_to_sync
import re

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['chat_id']
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        chat = Chat.objects.get(id=self.scope['url_route']['kwargs']['chat_id'])
        Message.objects.filter(chat=chat).exclude(author=self.scope['user']).update(is_read=True)

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message':'You are now connected!'
        }))
        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        user = self.scope['user']
        chat = Chat.objects.get(id=self.scope['url_route']['kwargs']['chat_id'])
        msg = Message.objects.create(author=user, content=message, is_read=False, chat=chat)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': msg.serialize()
            }
        )
    
    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message
        }))


class ProjectConsumer(WebsocketConsumer):
    def connect(self):
        self.project_id = re.search(r'/ws/socket-server/project/(?P<project_id>\d+)', self.scope['path']).group('project_id')
        self.group_name = str(self.project_id)

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

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        user = self.scope['user']
        chat = Chat.objects.get(project__id=self.project_id)
        msg = Message.objects.create(author=user, content=message, is_read=False, chat=chat)

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'message': msg.serialize()
            }
        )
    
    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message
        }))