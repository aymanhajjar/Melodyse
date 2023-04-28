from users.models import User, UserInfo

def genPrompt(user, with_interests, type, lyrics=None, sound=None, plugin=None, scale=None, skill=None):

    info = UserInfo.objects.get(user=user)

    if type == "feedback":
        if with_interests:
            return "For this prompt, I want you to assume that I am a songwriter who likes " + ', '.join([str(artist['name']) for artist in info.favorite_artists[:5]]) + ' and whose favorite songs include ' + ', '.join([str(song['name']) for song in info.favorite_songs[:5]]) + '. Keeping this in mind, I want you to give me feedback on these lyrics, and tell me what I need to change to make them better, if there is anything to change. And last, after you have given me your unbiased feedback, I want you to tell me how i can improve on them if i want my style to be similar to my favorite artists, specifying which one you are talking about. Here are the lyrics: ' + lyrics
        else :
            return "Give me your unbiased feedback on these lyrics, telling me what i can do to improve on them. Here are the lyrics: " + lyrics
        
    if type == "grammar":
        return "Fix the spelling and grammar of these lyrics. Do not modify and words or sentences that have correct spelling and grammar. In your response, I only want you to return the fixed lyrics, no text before or after or other than the fixed lyrics. Here are the lyrics: " + lyrics
    
    if type == "improve":
        if with_interests:
            return "For this prompt, I want you to assume that you are a songwriter who likes " + ', '.join([str(artist['name']) for artist in info.favorite_artists[:5]]) + ' and whose favorite songs include ' + ', '.join([str(song['name']) for song in info.favorite_songs[:5]]) + '. Keeping this in mind, I want you to improve on these lyrics, getting inspiration from your favorite songs and artists. If a part sounds good, leave it as it is. If a word or sentence can be improved, change it. Do not add more than 6 lines of lyrics, if needed. In your response, I only want you to return the improved lyrics, no text before or after or other than the improved lyrics. Do not label any part. Here are the lyrics: ' + lyrics
        else :
            return "I want you to improve on these lyrics, semantically and grammatically. If a part sounds good, leave it as it is. If a word or sentence can be improved, change it. Do not add more than 6 lines of lyrics, if needed. In your response, I only want you to return the improved lyrics, no text before or after or other than the improved lyrics. Do not label any part. Here are the lyrics: " + lyrics
    
    if type == "generate":
        if with_interests:
            return "For this prompt, I want you to assume that you are a songwriter who likes " + ', '.join([str(artist['name']) for artist in info.favorite_artists[:5]]) + ' and whose favorite songs include ' + ', '.join([str(song['name']) for song in info.favorite_songs[:5]]) + '. Keeping this in mind, I want you to write lyrics inspired by these artists and songs. Do not specify songs parts such as "verse" or "chorus". In your response, I only want you to return the generated lyrics, no text before or after or other than the generated lyrics.'
        else :
            return "Write lyrics, based on a topic of your choice. In your response, I only want you to return the generated lyrics, no text before or after or other than the generated lyrics."
        
    if type == "generateMelody":
        if with_interests:
            return "For this prompt, I want you to assume that i am a songwriter who likes " + ', '.join([str(artist['name']) for artist in info.favorite_artists[:5]]) + ' and whose favorite songs include ' + ', '.join([str(song['name']) for song in info.favorite_songs[:5]]) + '. Keeping this in mind, I want you to write me a melody for the provided lyrics inspired by my favorite artists and songs. In your response, i want you to include the melody you chose, and explain why i should use that melody, mentioning the artists or songs that inspired that melody, if any. I need you to tell me the melody for each part (i.e. "verse: melody chords", "chorus: melody chords", etc.). Here are the lyrics: ' + lyrics
        else :
            return 'Write me a melody for these lyrics. In your response, i want you to include the melody you chose, and explain why i should use that melody. I need you to tell me the melody for each part (i.e. "verse: melody chords", "chorus: melody chords", etc.). Here are the lyrics: ' + lyrics
        
    if type == "buildsound":
        if plugin:
            return "Using my music DAW, I want to build a sound similar to '" + sound + "', using the plugin '" + plugin + "'. Guide me step by step how to do it."
        else:    
            return "Using my music DAW, I want to build a sound similar to '" + sound + "'. Guide me step by step how to do it, mentioning the name of the plugin i need to use for this build."
        
    if type == "findbass":
        if with_interests:
            return "Find me good basslines of 4, 5, 6 steps that fit in this musical scale :'" + scale + "'. Get inspired by favorite artists: " + ', '.join([str(artist['name']) for artist in info.favorite_artists[:5]]) + ' and my favorite songs: ' + ', '.join([str(song['name']) for song in info.favorite_songs[:5]]) + ". Tell me which artists or songs you got inspired by, if any."
        else:    
            return "Find me good basslines of 4, 5, 6 steps that fit in this musical scale :'" + scale
    
    if type == "getTips":
        return "Tell me tips and tricks in for practicing " + skill + " in the form of bullet points."
        
        
    return None