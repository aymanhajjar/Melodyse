import json
from channels.generic.websocket import  WebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from users.models import Message


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_group_name = 'chat'
        # self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message':'You are now connected!'
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