import React, { Component } from 'react'

class BookShelfChanger extends Component {
  onChangeShelfBook = (value) => {
    this.props.onChangeShelfBook(this.props.bookId, value);
  }

  render() {
    return (
        <select onChange={(event) => this.onChangeShelfBook(event.target.value)}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading" selected={this.props.currentShelf == 'currentlyReading'}>Currently Reading</option>
            <option value="wantToRead" selected={this.props.currentShelf == 'wantToRead'}>Want to Read</option>
            <option value="read" selected={this.props.currentShelf == 'read'}>Read</option>
            <option value="none" selected={this.props.currentShelf == 'none'}>None</option>
        </select>
    );
  }
}

export default BookShelfChanger;