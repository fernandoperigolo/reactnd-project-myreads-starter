import React, { Component } from 'react'
import BookItem from './BookItem';

class BookShelf extends Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map((book) => (
              <BookItem book={book} key={book.id} onChangeShelfBook={this.props.onChangeShelfBook} />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default BookShelf;