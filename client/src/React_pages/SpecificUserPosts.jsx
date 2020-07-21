import React, { Component } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { getUsers, getPosts, getCategories } from "../services/apihelper";



class SpecificUserPosts extends Component {
    state = {
        posts: null,
          users: null,
        categories: null,
        post: {
          title: "",
          description: "",
          body: "",
        },
      };
    componentDidMount = async () => {
        const users = await getUsers();
        this.setState({
          users,
        });
        const id = this.props.match.params.id;
        const posts = await getUserPosts(id);
        this.setState({
          posts,
        });
        const categories = await getCategories();
        this.setState({
          categories,
        });
      };
    render() {

      return (
          <div>
              <h1>All Posts</h1>
        {this.state.posts &&
          this.state.posts.map((post) => (
            <div className="userpost" class="flex flex-col">
              <Link to={`/users/${post.id}`}></Link>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <p>{post.body}</p>
              <p>
                Posted by{" "}
                <Link to={`/user/${post.user_id}`}>{post.user.username}</Link>
              </p>
              <p>Created at {post.created_at}</p>
              <p>Last Updated {post.updated_at}</p>
            </div>
          ))}
      </div>
    );
  }
}
export default withRouter(AllPosts);
