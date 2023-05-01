import requests
import environ
import os

env = environ.Env()
environ.Env.read_env()

def extractGenres(songs):
    genres = []
    token = ''

    client_id = env('SPOTIFY_CLIENT_ID')
    client_secret = env('SPOTIFY_CLIENT_SECRET')

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
    }

    response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)

    if response.status_code == 200:
        token = response.json()['access_token']
    else:
        print(f'Error: {response.status_code}')

    for song in songs:
        headers = {
            "Authorization": 'Bearer ' + token
        }
        response = requests.get('https://api.spotify.com/v1/artists/' + song['artists'][0]['id'], headers=headers)

        for genre in response.json()['genres']:
            if genre not in genres:
                genres.append(genre)

    return genres