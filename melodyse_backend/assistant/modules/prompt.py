from users.models import User, UserInfo

def prompt(user, lyrics=None):
    
    info = UserInfo.objects.get(user=user)
    if lyrics:
        return "For this prompt, I want you to assume that I am a songwriter who likes " + ', '.join([str(artist.name) for artist in info.favorite_artists[:5]]) + ' and whose favorite songs include ' + ', '.join([str(song.name) for song in info.favorite_songs[:5]]) + '. Keeping this in mind, I want you to give me feedback on these lyrics, and tell me what I need to change to make them better, if there is anything to change. Here are the lyrics: ' + lyrics