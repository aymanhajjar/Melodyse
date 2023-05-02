from rest_framework.pagination import PageNumberPagination
from users.models import User, UserInfo
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from . import findMatch
from django.db.models import Q

class UsersPagination(PageNumberPagination):
    page_size = 9
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 9

class UsersView(APIView):
    pagination_class = UsersPagination()  

    def get(self, request):
        is_VIP = False
        is_PLUS = False
        rating = False
        skill = False
        q = False
        try:
            is_VIP = request.GET['is_vip']
        except:
            pass

        try:
            is_PLUS = request.GET['is_plus']
        except:
            pass

        try:
            rating = request.GET['rating']
        except:
            pass

        try:
            skill = request.GET['skill']
        except:
            pass

        try:
            q = request.GET['q']
        except:
            pass

        if request.user.is_authenticated:
            matches = findMatch.get(request.user.id)
            users = []
            kwargs = {}
            if is_VIP:
                kwargs['subscription__level'] = 2
            if is_PLUS:
                kwargs['subscription__level'] = 1
            if is_PLUS and is_VIP:
                del kwargs['subscription__level']
                kwargs['subscription__level__in'] = [1,2]
            if rating:
                kwargs['rating__gt'] = int(rating)-1
            if skill:
                kwargs['user__skills__skill__name'] = skill
            if q:
                kwargs['user__username__icontains'] = q 

            for id in matches:
                kwargs['user__id'] = id
                
                model = UserInfo.objects.filter(**kwargs).first()
                if model is not None:
                    serialized = model.serialize()
                    serialized['is_match'] = True
                    users.append(serialized)

            others = UserInfo.objects.filter(
                    ~Q(user__id__in=matches),
                    Q(subscription__level=2) if is_VIP else Q() | Q(subscription__level=1) if is_PLUS else Q(),
                    Q(rating__gt=int(rating)-1) if rating else Q(),
                    Q(user__skills__skill__name=skill) if skill else Q(),
                    Q(user__username__icontains=q) if q else Q()
                )
            
            for user in others:
                try:
                    users.append(user.serialize())
                except:
                    pass
            page = self.pagination_class.paginate_queryset(users, request)
            
            return Response(page)
            
        else:
            users = UserInfo.objects.all()
            page = self.pagination_class.paginate_queryset(users, request)
            return Response([user.serialize() for user in page])