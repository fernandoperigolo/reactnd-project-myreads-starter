import React, { Component } from 'react'

class BookShelfChanger extends Component {
  onChangeShelfBook = (value) => {
    this.props.onChangeShelfBook(this.props.book, value);
  }

  render() {
    return (
        <select onChange={(event) => this.onChangeShelfBook(event.target.value)} value={this.props.currentShelf}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
        </select>
    );
  }
}

export default BookShelfChanger;