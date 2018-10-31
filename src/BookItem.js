import React, { Component } from 'react'
import BookShelfChanger from './BookShelfChanger';

class BookItem extends Component {
  render() {
    const backgroundImage = this.props.book.imageLinks ? 'url(' + this.props.book.imageLinks.smallThumbnail + ')' : 'none';
    const authors = this.props.book.authors ? this.props.book.authors.join(", ") : 'Unknown Author'
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: backgroundImage }}></div>
            <div className="book-shelf-changer">
              <BookShelfChanger currentShelf={this.props.book.shelf} onChangeShelfBook={this.props.onChangeShelfBook} book={this.props.book} />
            </div>
          </div>
          <div className="book-title">{this.props.book.title}</div>
          <div className="book-authors">{authors}</div>
        </div>
      </li>
    );
  }
}

export default BookItem;