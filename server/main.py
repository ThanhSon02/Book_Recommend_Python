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

@app.get("/books/details/{isbn}")
def getBookDetails(isbn:str):
    books_df = pd.read_csv(path + '\Books.csv', dtype="string")
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]

    ratings_mean = ratings_df.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books_df = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    books_df.set_index('ISBN', inplace=True)
    return books_df.loc[isbn]

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