import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('melodyse_backend/dataset/Melodyse_dataset.csv', index_col=0)

def get_recommendations(user_id):
    user_ratings = df.loc[user_id].values.reshape(1, -1)
    similarities = cosine_similarity(df, user_ratings).flatten()
    recommended_genres = df.index[similarities.argsort()[::-1][1:]]
    return recommended_genres.tolist()


def get(id):
    recommended_genres = get_recommendations(str(id))
    return [int(x) for x in recommended_genres if x.isdigit()][:5]
