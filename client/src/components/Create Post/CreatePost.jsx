import React, { Component } from "react";

export default class CreatePost extends Component {
  state = {
    title: "",
    description: "",
    body: "",
  };

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }
    
    
  render() {
    return (
      <div>
        {/* {this.state.addPost && */}
            <form onSubmit={(e) => {
                e.preventDefault()
                this.props.handleAdd(this.state)
                this.props.history.push(`/profile/${this.props.currentUser.id}`)
        } }>
          <label>
            Title
            <input
              name="title"
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Description
            <input
              name="description"
              type="text"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>

          <label>
            Body
            <input
              name="body"
              type="text"
              value={this.state.body}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Add Post" />
        </form>
        {/* } */}
      </div>
    );
  }
}
