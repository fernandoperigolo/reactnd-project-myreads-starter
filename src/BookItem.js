import React, { Component } from 'react'
import BookShelfChanger from './BookShelfChanger';

class BookItem extends Component {
  render() {
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url('+this.props.book.imageLinks.smallThumbnail+')' }}></div>
            <div className="book-shelf-changer">
              <BookShelfChanger currentShelf={this.props.book.shelf} onChangeShelfBook={this.props.onChangeShelfBook} book={this.props.book} />
            </div>
          </div>
          <div className="book-title">{this.props.book.title}</div>
          <div className="book-authors">{this.props.book.authors.join(", ")}</div>
        </div>
      </li>
    );
  }
}

export default BookItem;