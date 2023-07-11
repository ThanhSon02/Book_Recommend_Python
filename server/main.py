import uvicorn
from fastapi import FastAPI
import numpy as np
import pandas as pd
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

path = os.path.dirname(__file__)

@app.get("/books/highestrating")
def getHighestRatedBooks():
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    books_df = books_df.dropna().drop(books_df[books_df["Year-Of-Publication"] == '0'].index)
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df.dropna().drop_duplicates(subset=['User-ID', 'ISBN'], keep='last')

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    popular = books_df.sort_values('Rating-Count', ascending=False)
    highestRated = popular[popular["Rating-Count"] > 100].sort_values('Book-Rating', ascending=False)
    highestRated.reset_index(drop=True, inplace=True)
    return highestRated.head(10).T

@app.get("/books/mostpopular")
def getMostPopularBooks():
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    books_df = books_df.dropna().drop(books_df[books_df["Year-Of-Publication"] == '0'].index)
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df.dropna().drop_duplicates(subset=['User-ID', 'ISBN'], keep='last')

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    popular = books_df.sort_values('Rating-Count', ascending=False)
    popular.reset_index(drop=True, inplace=True)
    return popular.head(10).T

@app.get("/books/details/{isbn}")
def getBookDetails(isbn:str):
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    books_df = books_df.dropna().drop(books_df[books_df["Year-Of-Publication"] == '0'].index)
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df.dropna().drop_duplicates(subset=['User-ID', 'ISBN'], keep='last')

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    books_df.set_index('ISBN', inplace=True)
    return books_df.loc[isbn]

if __name__ == "__main__":
    uvicorn.run(app)