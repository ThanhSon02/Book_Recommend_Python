import uvicorn

from typing import Union
from fastapi import FastAPI, Body
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

books_df = pd.read_csv(path + '\Books.csv', dtype="string")
ratings_df = pd.read_csv(path + '\Ratings.csv')
users_df = pd.read_csv(path + '\\Users.csv')

@app.get("/books/highestrated")
def getHighestRatedBooks():
    ratings = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_mean = ratings.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    highestRated = books[books["Rating-Count"] > 100].sort_values('Book-Rating', ascending=False)
    highestRated.reset_index(drop=True, inplace=True)
    return highestRated.head(10).T

@app.get("/books/mostpopular")
def getMostPopularBooks():
    ratings = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_mean = ratings.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    popular = books.sort_values('Rating-Count', ascending=False)
    popular.reset_index(drop=True, inplace=True)
    return popular.head(10).T

#numpy
@app.get("/books/details/{isbn}")
def getBookDetails(isbn:str):
    if isbn in np.array(books_df['ISBN']):
        ratings = ratings_df[ratings_df['Book-Rating'] != 0]
        book_ratings = np.array(ratings[ratings['ISBN'] == isbn]['Book-Rating'])
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
    ratings = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings_mean = ratings.groupby("ISBN").agg({'Book-Rating': 'mean', 'User-ID': 'count'}).rename(columns={'User-ID': 'Rating-Count'})
    books = pd.merge(books_df, ratings_mean, on='ISBN', how='left')
    authors_rating = books.dropna().groupby('Book-Author').agg({'Book-Rating': 'mean', 'ISBN': 'count', 'Rating-Count': 'sum'}).rename(columns={'ISBN': 'Book-Count'})
    authors_rating = authors_rating[['Book-Rating', 'Book-Count', 'Rating-Count']]
    authors_rating = authors_rating = authors_rating[(authors_rating["Rating-Count"] > 400) & (authors_rating["Book-Count"] > 5)].sort_values('Book-Rating', ascending=False)
    authors_rating.reset_index(inplace=True)
    return authors_rating.head(10).T

#numpy
@app.get("/books/correlation/{isbn1}&{isbn2}")
def getBookCorrelation(isbn1, isbn2):
    books = np.array(books_df['ISBN'])
    if isbn1 not in books or isbn2 not in books:
        return "Book(s) doesn't exist"
    ratings = ratings_df[ratings_df['Book-Rating'] != 0]
    ratings = ratings.dropna(subset=['User-ID', 'ISBN'])
    ratings = ratings[(ratings['ISBN'] == isbn1) | (ratings['ISBN'] == isbn2)]

    ratings_pivot = ratings.pivot_table(index='User-ID', columns='ISBN', values='Book-Rating')
    ratings_pivot = ratings_pivot.dropna()
    if len(ratings_pivot) == 0:
        return "Can't calculate the correlation"
    if (np.std(np.array(ratings_pivot[isbn1])) == 0 or np.std(np.array(ratings_pivot[isbn2])) == 0):
        return "Can't calculate the correlation"
    corr_matrix = np.corrcoef(ratings_pivot[isbn1], ratings_pivot[isbn2])
    return corr_matrix[0, 1]

class Rating(BaseModel):
    userId: int
    isbn: str
    bookRating: float

@app.post("/books/rate")
def rateBook(rating: Rating):
    global ratings_df
    if rating.isbn not in np.array(books_df['ISBN']):
        return "Book doesn't exist"
    if (len(ratings_df[(ratings_df['ISBN'] == rating.isbn) & (ratings_df['User-ID'] == rating.userId)]) > 0):
        ratings_df.loc[(ratings_df['ISBN'] == rating.isbn) & (ratings_df['User-ID'] == rating.userId), 'Book-Rating'] = rating.bookRating
    else:
        row = [rating.userId, rating.isbn, rating.bookRating]
        ratings_df.loc[len(ratings_df)] = row
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
    global books_df
    if book.isbn in np.array(books_df['ISBN']):
        return 'Book with this ISBN already exist'
    row = [book.isbn, book.title, book.author, 
           book.publishYear, book.publisher,
           book.imgS, book.imgM, book.imgL]
    books_df.loc[len(books_df)] = row 
    books_df.to_csv(path + '\Books.csv', index=False)
    return "Successfully added a book"

@app.post("/books/update")
def updateBook(book: Book):
    global books_df
    if book.isbn not in np.array(books_df['ISBN']):
        return "Book doesn't exist. Considering add a new book"
    row = [book.isbn, book.title, book.author, 
           book.publishYear, book.publisher,
           book.imgS, book.imgM, book.imgL]
    books_df.loc[books_df['ISBN'] == book.isbn] = row
    books_df.to_csv(path + '\Books.csv', index=False)
    return "Successfully updated a book"

@app.post("/books/delete")
def deleteBook(payload: dict = Body(...)):
    global books_df
    isbn = payload["data"]["isbn"]
    if isbn not in np.array(books_df['ISBN']):
        return "Book doesn't exist. Considering add a new book"
    books_df.drop(books_df[books_df["ISBN"] == isbn].index, inplace=True)
    books_df.reset_index(drop=True, inplace=True)
    books_df.to_csv(path + '\Books.csv', index=False)
    return "Successfully deleted a book"

if __name__ == "__main__":
    uvicorn.run(app)