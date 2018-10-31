import React from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
  state = {
    books: [],
    query: '',
    searchResults: []
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

  changeShelfBook = (bookTochange, shelf) => {
    let isBookInList = false;
    BooksAPI.update({id:bookTochange.id},shelf).then((result) => {
      const books = this.state.books.map((book) => {
        if(book.id === bookTochange.id) {
          book.shelf = shelf;
          isBookInList = true;
        }
        return book;
      });

      if(isBookInList === false){
        bookTochange.shelf = shelf;
        books.push(bookTochange);
      }

      this.setState({
        books
      });
    });
  }

  onChangeSearchTerm = (searchTerm) => {
    this.setState({
      query: searchTerm
    });
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
        BooksAPI.search(this.state.query).then((booksFinded) => {
          if(booksFinded.length > 0){
            // Varro todos os livros encontrados
            const booksFindedFiltered = booksFinded.map((bookFinded) => {
              // Seto os livros como none por padrão
              bookFinded.shelf = 'none';
              // Confiro nos livros do state se algum foi retornado na busca
              this.state.books.map((book) => {
                if(bookFinded.id === book.id){
                  // Se um livro do state for igual a um livro retornado na busca, atribuo o shelf correto no resultado da busca
                  bookFinded.shelf = book.shelf;
                }
              });
              return bookFinded;
            });
            this.setState({
              searchResults: booksFindedFiltered
            });
          } else {
            this.setState({
              searchResults: []
            });
          }
        });
    }, 1000);
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
                <input type="text" placeholder="Search by title or author" onChange={(event) => this.onChangeSearchTerm(event.target.value)} value={this.state.query} />
              </div>
            </div>
            <div className="search-books-results">
              <BookShelf shelfTitle="Search Results" books={this.state.searchResults} onChangeShelfBook={this.changeShelfBook} />
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
