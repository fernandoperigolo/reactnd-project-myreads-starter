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
    searchResults: [],
    isLoadingSearch: false
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
    // Tento trocar o livro de shelf
    BooksAPI.update({id:bookTochange.id},shelf).then((result) => {
      // Se consigo atualizar, varro os livros do state
      const books = this.state.books.map((book) => {
        // Verifico se o livro já está em algum shelf
        if(book.id === bookTochange.id) {
          // Se o livro já está em algum shelf, troco ele de shelf e seto a variável de controle como true
          book.shelf = shelf;
          isBookInList = true;
        }
        return book;
      });

      // Se a variável de controle for false, significa que o livro não está em nenhum shelf
      if(isBookInList === false){
        // Atribuo o novo livro ao shelf selecionado e adiciono ele a lista de livros no state
        bookTochange.shelf = shelf;
        books.push(bookTochange);
      }

      this.setState({
        books
      });
    });
  }

  onChangeSearchTerm = (searchTerm) => {
    // Quando o termo muda, já limpo o resultado da busca e atualizo o termo
    this.setState({
      searchResults: [],
      query: searchTerm
    });
    clearTimeout(this.delayTimer);
    // Se tiver algum termo de busca
    if(searchTerm !== '') {
      // Informo que vou carregar
      this.setState({
        isLoadingSearch: true
      });
      this.delayTimer = setTimeout(() => {
          BooksAPI.search(this.state.query).then((booksFinded) => {
            // Informo que a busca terminou
            this.setState({
              isLoadingSearch: false
            });
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
                  return book;
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
  }

  render() {
    const currentlyReadingBooks = this.filterBooks(this.state.books,'currentlyReading');
    const wantToReadBooks = this.filterBooks(this.state.books,'wantToRead');
    const readBooks = this.filterBooks(this.state.books,'read');
    // Controle da mensagem que será exibida no resultado da busca
    let loadingMessage = '';
    if(!this.state.query) {
      loadingMessage = 'Start typing to search a book';
    }
    if(this.state.query && this.state.searchResults.length === 0 && !this.state.isLoadingSearch) {
      loadingMessage = 'No books finded';
    }
    if(this.state.isLoadingSearch) {
      loadingMessage = 'Searching books...';
    }

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
              {loadingMessage !== '' && 
                <p className="loadgin-message">{loadingMessage}</p>
              }
              {this.state.searchResults.length > 0 &&
                <BookShelf shelfTitle="Search Results" books={this.state.searchResults} onChangeShelfBook={this.changeShelfBook} />
              }
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
