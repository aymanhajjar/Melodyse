from django.shortcuts import render
from rest_framework.pagination import PageNumberPagination
from users.models import Chat
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class MessagePagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 20

class ChatView(APIView):
    pagination_class = MessagePagination()  

    def get(self, request):
        id = request.GET['id']
        if request.user.is_authenticated:
            chat = Chat.objects.get(id=id, participants=request.user)
            if chat:
                messages = chat.messages.all().order_by('-date_created')
                
                if messages:
                    page = self.pagination_class.paginate_queryset(messages, request)

                    if page is not None:
                        messages_list = [message.serialize() for message in page]

                        for msg in messages_list:
                            if msg['author_username'] == request.user.username:
                                msg['is_mine'] = True
                            else:
                                msg['is_mine'] = False

                        return Response(messages_list)

                    return Response([message.serialize() for message in messages])
                
                return Response([], safe=False)
            
            return HttpResponse('Not allowed', status=403)
            
        else:
            return HttpResponse('User not logged in', status=403)