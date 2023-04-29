from django.http import JsonResponse, HttpResponse
from users.models import UserInfo, Track, TrackComment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
# Create your views here.

class TrackPagination(PageNumberPagination):
    page_size = 3
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 3
    
class getTracks(APIView):
    pagination_class = TrackPagination()

    def get(self, request):
        queryset = Track.objects.all()
        page = self.pagination_class.paginate_queryset(queryset, request)

        if page is not None:
            return Response([track.serialize() for track in page])

        return Response([track.serialize() for track in queryset])

def getArtists(request):
    
    top_artists = UserInfo.objects.all().order_by('-rating')[:8]

    return JsonResponse([artist.serialize() for artist in top_artists], safe=False)

def search(request):
    query = request.GET['q']

    artists = UserInfo.objects.filter(Q(user__username__icontains=query) | Q(user__first_name__icontains=query) | Q(user__last_name__icontains=query))
    tracks = Track.objects.filter(name__icontains=query)

    res = {
        'artists': [artist.serialize() for artist in artists],
        'tracks': [track.serialize() for track in tracks]
    }

    return JsonResponse(res, safe=False)