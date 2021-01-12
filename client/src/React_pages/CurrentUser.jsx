import React, { Component } from "react";
import {
  getUserPosts,
  addPost,
  deletePost,
  updatePost,
} from "../services/apihelper";
import { withRouter, Link } from "react-router-dom";
import Moment from "react-moment";

class CurrentUser extends Component {
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
    if (this.props.post) this.setFormData();
  };

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
      posts: prevState.posts.filter((onePost) => onePost.id != deleted.id),
    }));
  };

  render() {
    return (
      <div class="py-2 max-w-full" className="Contains-All">
        <h1 className="Post-Page-Title">Your Posts</h1>
        {this.state.posts &&
          this.state.posts.map((post) => (
            <div className="State-div">
              <ul className="Table-Flex-Contain">
                <li style={{ display: "block" }}>
                  <p className="Post-Title">{post.title}</p>

                  <hr className="Table-Divide"></hr>
                </li>
                <li style={{ padding: "0.767vw 0" }}>
                  <p>
                    <strong>Description: </strong>
                    {post.description}
                  </p>
                </li>
                <hr className="Table-Divide"></hr>
                <li style={{ padding: "0.767vw 0" }}>
                  <p class="font-light">{post.body}</p>
                </li>
                <hr className="Table-Divide"></hr>

                <li style={{ padding: "0.267vw 0" }}>
                  <p className="Post-Info">
                    <strong>Created on:&nbsp;</strong>{" "}
                    <Moment format="MMM D, YYYY" withTitle>
                      {post.created_at}
                    </Moment>
                    <br></br>
                    <strong>Last updated:</strong>{" "}
                    <Moment fromNow ago>
                      {post.updated_at}
                    </Moment>
                    &nbsp;ago
                  </p>
                </li>

                <strong className="Category-Descrip">Categories:</strong>
                <li className="Cat-Button-Contain">
                  {post.categories.map((category) => (
                    <button>
                      <Link
                        to={`/category/${category.id}`}
                        class="font-medium text-white"
                      >
                        {category.name}
                      </Link>
                    </button>
                  ))}
                </li>
              </ul>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "flex-start",
                }}
              >
                <li className="CRUD-Buttons">
                  <button>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      class="font-bold text-white"
                    >
                      Edit
                    </Link>
                  </button>
                  <button
                    class="font-medium text-white"
                    placeholder="Delete"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete?")) {
                        this.removePosts(post.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button class="font-medium text-white">
                    <Link to="/post/new">New</Link>
                  </button>
                </li>
              </ul>
            </div>
          ))}
      </div>
    );
  }
}

export default withRouter(CurrentUser);
