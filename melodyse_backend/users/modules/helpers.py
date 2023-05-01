import requests
import environ
import os
import pandas as pd

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

def addtoDataset(id, genres):
    df = pd.read_csv('melodyse_backend/dataset/Melodyse_dataset.csv', index_col=0)

    user_id = id
    genres = genres

    user_data = {'pop': 0, 'rock': 0, 'pop rock': 0, 'hip hop music': 0, 'acoustic': 0, 'edm': 0, 'classical': 0, 
                    'indie pop': 0, 'indie rock': 0, 'country': 0, 'latin': 0, 'jazz': 0, 'drill': 0, 'house': 0, 
                    'teen': 0, 'trap': 0, 'dubstep': 0, 'pop dance': 0, 'country rock': 0, 'canadian pop': 0, 
                    'contemporary r&b': 0, 'tropical house': 0, 'viral pop': 0, 'pop rap': 0, 'southern hip hop': 0, 'celtic rock': 0, 'rap': 0, 'boy band': 0, 'post-teen pop': 0}
    if str(user_id) in df.index:
        user_data = df.loc[str(user_id)]

    for genre in genres:
        user_data[genre] = 5

    df.loc[str(user_id)] = user_data

    df.to_csv('melodyse_backend/dataset/Melodyse_dataset.csv')