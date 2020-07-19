
import React, { Component } from 'react';
import { getUserPosts, addPost } from '../services/apihelper'
import { withRouter, Link } from 'react-router-dom'

class User_Profile extends Component {
  state = {
    posts: null,
    addPost: false,
    post: {
      title: '',
        description: '',
      body: ''
    }
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id
    const posts = await getUserPosts(id)
    this.setState({
      posts
    })
  }

  toggleAdd = () => {
    this.setState(prevState => ({
      addPost: !prevState.addPost
    }))
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      post: {
        ...prevState.post,
        [name]: value
      }
    }))
  }

    handleAdd = async (e) => {
        e.preventDefault();
        const newPost = await addPost(this.props.match.params.id, this.state.post)
        this.setState(prevState => ({
            post: [...prevState.post, newPost]
        }))
    }
  render() {
    return (
      <div>
            <h1>Posts</h1>
        {this.state.posts && this.state.posts.map(post => (
          <div className="post">
                <h3>{post.title}</h3>
                <h3>{post.description}</h3>
                <h3>{post.body}</h3>
          </div>
        ))}
        <Link to="/post/new">
        <button>New</button>
                </Link>
      </div>
    )
  }
}

export default withRouter(User_Profile)