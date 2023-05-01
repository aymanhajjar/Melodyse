from rest_framework.pagination import PageNumberPagination
from users.models import User, UserInfo
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from . import findMatch

class UsersPagination(PageNumberPagination):
    page_size = 9
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 9

class UsersView(APIView):
    pagination_class = UsersPagination()  

    def get(self, request):
        print('heyy')

        if request.user.is_authenticated:
            matches = findMatch.get(request.user.id)
            users = []
            for id in matches:
                model = UserInfo.objects.get(user__id=id)
                users.append(model.serialize())
            
            return Response(users)
            
        else:
            users = UserInfo.objects.all()
            page = self.pagination_class.paginate_queryset(users, request)
            return Response([user.serialize() for user in page])