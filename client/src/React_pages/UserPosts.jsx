import React, { Component } from "react";
import { getUserPosts, addPost, deletePost, updatePost } from "../services/apihelper";
import { withRouter, Link } from "react-router-dom";

class User_Profile extends Component {
  state = {
    posts: null,
    addPost: false,
    post: {
      title: "",
      description: "",
      body: "",
    },
  };

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    const posts = await getUserPosts(id);
    this.setState({
      posts,
    });
      if (this.props.post)
      this.setFormData();
    }
  
  
  

  toggleAdd = () => {
    this.setState((prevState) => ({
      addPost: !prevState.addPost,
    }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      post: {
        ...prevState.post,
        [name]: value,
      },
    }));
  };

  handleAdd = async (e) => {
    e.preventDefault();
    const newPost = await addPost(this.props.match.params.id, this.state.post);
    this.setState((prevState) => ({
      posts: [...prevState.posts, newPost],
    }));
  };

  removePosts = async (id) => {
      const deleted = await deletePost(id);
      this.setState((prevState) => ({
          posts: prevState.posts.filter(onePost => onePost.id != deleted.id)
      }))
  };
    
    // editPosts = async (id) => {
    //     const updated = await updatePost(id);
    //     this.setState(prevState) => ({
    //         posts: prevState.posts.map(oldPost => oldPost.id === updatedId ? newPost : oldPost)
    //       })
    // }

    
  render() {

    return (
      <div>
        <h1>Your Posts</h1>
        {this.state.posts &&
          this.state.posts.map((post) => (
            <div className="post">
              <h3>{post.title}</h3>
              <h3>{post.description}</h3>
              <h3>{post.body}</h3>

              <button
                placeholder="Delete"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete?")) {
                    this.removePosts(post.id);
                  }
                }}
              >
                delete
              </button>
            </div>
          ))}

        <Link to="/post/new">
          <button>New</button>
        </Link>
      </div>
    );
  }
}

export default withRouter(User_Profile);