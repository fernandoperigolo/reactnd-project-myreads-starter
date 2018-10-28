import React from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState(() => ({
        books
      }));
    });
  }

  filterBooks = (books,shelf) => {
    return books.filter((book) => {
      return book.shelf === shelf;
    })
  }

  changeShelfBook = (bookId, shelf) => {
    const books = this.state.books.map((book) => {
      if(book.id === bookId) {
        book.shelf = shelf;
      }
      return book;
    });
    this.setState({
      books
    });
  }

  render() {
    const currentlyReadingBooks = this.filterBooks(this.state.books,'currentlyReading');
    const wantToReadBooks = this.filterBooks(this.state.books,'wantToRead');
    const readBooks = this.filterBooks(this.state.books,'read');

    return (
      <div className="app">
        <Route exact path='/' render={({ history }) => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf shelfTitle="Currently Reading" books={currentlyReadingBooks} onChangeShelfBook={this.changeShelfBook} />
                <BookShelf shelfTitle="Want To Read" books={wantToReadBooks} onChangeShelfBook={this.changeShelfBook} />
                <BookShelf shelfTitle="Read" books={readBooks} onChangeShelfBook={this.changeShelfBook} />
              </div>
            </div>
            <div className="open-search">
              <Link
                to="/search"
                className="add-link"
              >Add a book</Link>
            </div>
          </div>
        )} />

        <Route exact path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                to="/"
                className="close-search"
              >Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
