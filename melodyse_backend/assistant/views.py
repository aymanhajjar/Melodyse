from django.shortcuts import render
import environ
import openai
from django.http import JsonResponse, HttpResponse
from .modules import prompt

env = environ.Env()
environ.Env.read_env()

# openai.api_key = os.getenv("OPENAI_API_KEY")

# Create your views here.

def improve(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, lyrics=lyrics, with_interests=with_interests, type="improve"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)

def feedback(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, lyrics=lyrics, with_interests=with_interests, type="feedback"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)

def grammar(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, lyrics=lyrics, with_interests=with_interests, type="grammar"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)

def generate(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, lyrics=lyrics, with_interests=with_interests, type="generate"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)


def generateMelody(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, lyrics=lyrics, with_interests=with_interests, type="generateMelody"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)

def buildSound(request):
    if request.user.is_authenticated:

        sound = request.POST['sound']
        plugin = request.POST['plugin']

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=False, sound=sound, plugin=plugin, type="buildsound"),
            temperature=0,
            max_tokens=1000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            stop=["\"\"\""]
        )

        return JsonResponse(response, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)