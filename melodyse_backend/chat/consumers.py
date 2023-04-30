import json
from channels.generic.websocket import  WebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from users.models import Message, Chat
from asgiref.sync import async_to_sync

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

    # def disconnect(self, close_code):
    #     await self.channel_layer.group_discard(
    #         self.room_group_name,
    #         self.channel_name
    #     )

    # @database_sync_to_async
    # def create_message(self, message, username):
    #     message_obj = Message.objects.create(
    #         content=message,
    #         username=username
    #     )
    #     return message_obj

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     message = data['message']
    #     username = data['username']

    #     # Create a new message object and save it to the database
    #     message_obj = await self.create_message(message, username)

    #     # Send the message to the group
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message_obj.content,
    #             'username': message_obj.username,
    #             'timestamp': str(message_obj.timestamp)
    #         }
    #     )

    # async def chat_message(self, event):
    #     message = event['message']
    #     username = event['username']
    #     timestamp = event['timestamp']

    #     # Send the message to the websocket
    #     await self.send(text_data=json.dumps({
    #         'message': message,
    #         'username': username,
    #         'timestamp': timestamp
    #     }))