from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<chat_id>\d+)', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/socket-server/project/(?P<project_id>\d+)', consumers.ProjectConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})