from django.shortcuts import render
import environ
import openai
from django.http import JsonResponse, HttpResponse
from modules import prompt

env = environ.Env()
environ.Env.read_env()

# openai.api_key = os.getenv("OPENAI_API_KEY")

# Create your views here.

def improve(request):
    pass

def feedback(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']

        response = openai.Completion.create(
        model="text-davinci-003",
        prompt= prompt(request.user, lyrics),
        temperature=0,
        max_tokens=100,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)

def grammar(request):
    pass

def generate(request):
    pass

def generateMelody(request):
    pass