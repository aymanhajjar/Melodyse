from django.shortcuts import render
from rest_framework.pagination import PageNumberPagination
from users.models import Chat, User, File, Project
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
import os
import json

# Create your views here.
class MessagePagination(PageNumberPagination):
    page_size = 20
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 20

class ChatView(APIView):
    pagination_class = MessagePagination()  

    def get(self, request):
        id = None
        username = None
        project = None
        try:
            id = request.GET['id']
        except:
            try:
                username = request.GET['username']
            except:
                project = request.GET['project']

        if request.user.is_authenticated:
            
            if id:
                chat = Chat.objects.get(id=id, participants=request.user)
            elif username:
                target_user = User.objects.get(username=username)
                chat = Chat.objects.filter(participants__username=request.user.username).filter(participants__username=username).first()
            elif project:
                chat = Chat.objects.get(project__id=project)

            if chat:
                messages = chat.messages.all().order_by('-date_created')
                
                if messages:
                    page = self.pagination_class.paginate_queryset(messages, request)

                    if page is not None:
                        return Response({'chat_id': chat.id, 'messages': [message.serialize() for message in page]})

                    return Response({'chat_id': chat.id, 'messages': [message.serialize() for message in messages]})
                
                return Response({'chat_id': chat.id, 'messages': []})
            
            else:
                target_user = User.objects.get(username=username)
                chat = Chat.objects.create(admin=request.user)
                chat.participants.add(request.user, target_user)
                chat.save()
                serialized = chat.serialize()
                
                serialized['participant'] = ', '.join([participant.first_name + ' ' + participant.last_name for participant in chat.participants.all().exclude(id=request.user.id)])
                serialized['participant_img'] = chat.participants.exclude(id=request.user.id).first().info.get().picture.url
                serialized['user_id'] = request.user.id

                return Response({'chat_id': chat.id, 'chat' : serialized, 'messages': []})
            
        else:
            return HttpResponse('User not logged in', status=403)

def uploadFile(request):
    if request.user.is_authenticated:
        file = request.FILES.get('file')
        id = request.POST['id']
        print('iddd ', id)
        project = Project.objects.get(id=id)
        newfile = File.objects.create(file=file, name = os.path.splitext(file.name)[0], owner=request.user, project=project)
        return JsonResponse(newfile.serialize(), safe=False)
    else:
        return HttpResponse('User not logged in', status=403)