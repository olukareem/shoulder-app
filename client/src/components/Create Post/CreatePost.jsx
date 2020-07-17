import React, { Component } from 'react'

export default class CreatePost extends Component {
    render() {
        return (
            <div>
                  {this.state.addPost &&
          <form onSubmit={this.handleAdd}>
            <label>Title
            <input
                name='title'
                type='text'
                value={this.state.post.title}
                onChange={this.handleChange} />
            </label>
            <label>Description
            <input
                name='description'
                type='text'
                value={this.state.post.description}
                onChange={this.handleChange} />
                </label>
                
                <label>Body
            <input
                name='body'
                type='text'
                value={this.state.post.body}
                onChange={this.handleChange} />
                </label>
            <input type='submit' value="Add Post" />
          </form>}
            </div>
        )
    }
}
