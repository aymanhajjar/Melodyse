from django.shortcuts import render
import environ
import openai
from django.http import JsonResponse, HttpResponse
from .modules import prompt

env = environ.Env()
environ.Env.read_env()

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
    
def findBass(request):
    if request.user.is_authenticated:

        scale = request.POST['scale']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, scale=scale, type="findbass"),
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
    
def getTips(request):
    if request.user.is_authenticated:

        skill = request.GET['skill']

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=False, skill=skill, type="getTips"),
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
    
def songsToLearn(request):
    if request.user.is_authenticated:

        skill = request.GET['skill']
        with_interests = request.GET['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, skill=skill, type="getSongsToLearn"),
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
    
def suggestResources(request):
    if request.user.is_authenticated:

        skill = request.GET['skill']
        with_interests = request.GET['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, skill=skill, type="suggestResources"),
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
    
def explainMusic(request):
    if request.user.is_authenticated:

        skill = request.GET['skill']
        with_interests = request.GET['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, skill=skill, type="explainMusic"),
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
    
def findTitle(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        genre = request.POST['genre']
        mood = request.POST['mood']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, lyrics=lyrics, genre=genre, mood=mood, type="findTitle"),
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
    
def suggestCover(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        genre = request.POST['genre']
        mood = request.POST['mood']
        title = request.POST['title']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, lyrics=lyrics, genre=genre, mood=mood, type="suggestCover", title=title),
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
    
def generateCover(request):
    if request.user.is_authenticated:

        lyrics = request.POST['lyrics']
        genre = request.POST['genre']
        mood = request.POST['mood']
        title = request.POST['title']
        with_interests = request.POST['with_interests'].lower() == "true"

        response = openai.Image.create(
        prompt= prompt.genPrompt(user=request.user, with_interests=with_interests, genre=genre, mood=mood, title=title, type="generateCover"),
        n=1,
        size="1024x1024"
        )
        image_url = response['data'][0]['url']

        return JsonResponse(image_url, safe=False)
    
    else:
        return HttpResponse('User not logged in', status=403)