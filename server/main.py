import uvicorn

from fastapi import FastAPI
from typing import Union
from fastapi import FastAPI
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
        book = books_df[books_df["ISBN"] == isbn].to_dict(orient='records')[0]
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

#numpy
@app.get("/books/correlation/{isbn1}&{isbn2}")
def getBookCorrelation(isbn1, isbn2):
    books = np.array(pd.read_csv(path + '\Books.csv'))
    if isbn1 not in books or isbn2 not in books:
        return "Book(s) doesn't exist"
    ratings_df = pd.read_csv(path + '\Ratings.csv')
    ratings_df = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_df = ratings_df.dropna(subset=['User-ID', 'ISBN'])
    ratings_df = ratings_df[(ratings_df['ISBN'] == isbn1) | (ratings_df['ISBN'] == isbn2)]

    ratings_pivot = ratings_df.pivot_table(index='User-ID', columns='ISBN', values='Book-Rating')
    ratings_pivot = ratings_pivot.replace([np.inf, -np.inf], np.nan).dropna()
    if (np.std(np.array(ratings_pivot[isbn1])) == 0 or np.std(np.array(ratings_pivot[isbn2])) == 0):
        return "Can't calculate the correlation"
    corr_matrix = np.corrcoef(ratings_pivot[isbn1], ratings_pivot[isbn2])
    return corr_matrix[0, 1]

class Rating(BaseModel):
    userId: int
    isbn: str
    bookRating: float


@app.post("/ratings/add")
def rateBook(rating: Rating):
    users_df = pd.read_csv(path + '\\Users.csv')
    books_df = pd.read_csv(path + '\Books.csv')
    ratings_df = pd.read_csv(path + '\Ratings.csv')

    if rating.userId not in np.array(users_df['User-ID']):
        return "User doesn't exist"
    if rating.isbn not in np.array(books_df['ISBN']):
        return "Book doesn't exist"
    if (rating.userId in np.array(ratings_df['User-ID']) and rating.isbn in np.array(ratings_df['ISBN'])):
        ratings_df.loc[(ratings_df['ISBN'] == rating.isbn) & (ratings_df['User-ID'] == rating.userId), 'Book-Rating'] = rating.bookRating
    else:
        row = {'User-ID': rating.userId, 'ISBN': rating.isbn, 'Book-Rating': rating.bookRating}
        ratings_df = ratings_df.append(row, ignore_index=True)
    ratings_df.to_csv(path + '\Ratings.csv', index=False)
    return "Successfully rated a book"

class Book(BaseModel):
    isbn: str
    title: str
    author: str
    publishYear: int
    publisher: str
    imgS: str
    imgM: str
    imgL: str

@app.post("/books/add")
def addBook(book: Book):
    books_df = pd.read_csv(path + '\Books.csv')
    if book.isbn in np.array(books_df['ISBN']):
        return 'Book with this ISBN already exist'
    row = {'ISBN': book.isbn, 'Book-Title': book.title, 'Book-Author': book.author, 
           'Year-Of-Publication': book.publishYear, 'Publisher': book.publisher,
           'Image-URL-S': book.imgS, 'Image-URL-M': book.imgM, 'Image-URL-L': book.imgL}
    books_df = books_df.append(row, ignore_index=True)
    books_df.to_csv(path + '\Books.csv', index=False)
    return "Successfully added a book"



if __name__ == "__main__":
    uvicorn.run(app)