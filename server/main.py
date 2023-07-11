from typing import Union
from fastapi import FastAPI
import numpy as np
import pandas as pd

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/books/highestrating")
def getHighestRatedBooks():
    books_df = pd.read_csv('Books.csv', dtype="string")
    books_df = books_df.dropna()
    ratings_df = pd.read_csv('Ratings.csv')
    ratings_df = ratings_df.dropna()

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    highestRated = books_df.where(books_df['Rating-Count'] > 10).dropna(subset=['ISBN']).sort_values('Book-Rating', ascending=False).head(10)
    return highestRated

@app.get("/books")
def showBooks():
    return {
        "books": ["fehwi", "fehwi", "fehwi", "fehwi", "fehwi", "fehwi", "fehwi", "fehwi", "fehwi",],
        "author": "Thanh Son"
    }