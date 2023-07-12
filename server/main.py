import uvicorn

from fastapi import FastAPI
from typing import Union
from fastapi import FastAPI
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI()


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


path = os.path.dirname(__file__)

@app.get("/books/highestrated")
def getHighestRatedBooks():
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    highestRated = books_df[books_df["Rating-Count"] > 100].sort_values('Book-Rating', ascending=False)
    highestRated.reset_index(drop=True, inplace=True)
    return highestRated.head(10).T

@app.get("/books/mostpopular")
def getMostPopularBooks():
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    popular = books_df.sort_values('Rating-Count', ascending=False)
    popular.reset_index(drop=True, inplace=True)
    return popular.head(10).T

#numpy
@app.get("/books/details/{isbn}")
def getBookDetails(isbn:str):
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    if isbn in np.array(books_df['ISBN']):
        ratings_df = pd.read_csv(path + '\Ratings.csv')
        ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]
        book_ratings = np.array(ratings_df[ratings_df['ISBN'] == isbn]['Book-Rating'])
        book = books_df[books_df["ISBN"] == '0439139597'].to_dict(orient='records')[0]
        if len(book_ratings) > 0:
            rating = np.round(np.mean(book_ratings), 1)
            book['Book-Rating'] = rating
        else: 
            book['Book-Rating'] = 'No ratings yet'
        return book
    return "There's no data of this book"

@app.get("/authors/highestrated")
def getHighestRatedAuthors():
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    authors_rating = books_df.dropna().groupby('Book-Author').agg({'Book-Rating': 'mean', 'ISBN': 'count', 'Rating-Count': 'sum'}).rename(columns={'ISBN': 'Book-Count'})
    authors_rating = authors_rating[['Book-Rating', 'Book-Count', 'Rating-Count']]
    authors_rating = authors_rating = authors_rating[(authors_rating["Rating-Count"] > 400) & (authors_rating["Book-Count"] > 5)].sort_values('Book-Rating', ascending=False)
    authors_rating.reset_index(inplace=True)
    return authors_rating.head(10).T

@app.get("/users/countriesdistribution")
def getTopUsersCountries():
    users_df = pd.read_csv(path + '\\Users.csv')
    countries = []
    cond = users_df['Location'].str.split(', ')
    for cont in cond:
        countries.append(cont[-1])
    users_df['Country'] = countries
    countries_df = users_df['Country'].value_counts()
    countries_df = countries_df.to_frame()
    countries_df.reset_index(inplace=True)
    countries_df = countries_df.rename(columns={'index':'Country', 'Country': 'User-Count'})
    return countries_df.head().T

if __name__ == "__main__":
    uvicorn.run(app)
