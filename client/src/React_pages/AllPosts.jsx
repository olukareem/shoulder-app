import React, { Component } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { getUsers, getPosts, getCategories } from "../services/apihelper";



class AllPosts extends Component {
    state = {
        posts: null,
          users: null,
        categories: null,
        post: {
          title: "",
          description: "",
          body: "",
        },
        categories: [],
        category_ids: [],
      };
    componentDidMount = async () => {
        const users = await getUsers();
        this.setState({
          users,
        });
        const posts = await getPosts();
        this.setState({
          posts,
        });
        const categories = await getCategories();
        this.setState({
          categories,
          
        });
        console.log(categories);

        const categoriesData = await getCategories();
        console.log(categoriesData);
        console.log(categories);

        this.setState({
          categories: categoriesData,
        });  
        console.log(categoriesData);

      };
    render() {
        const categoriesData = this.state.categories.map((category) => (
            <div>
              <button>{category.name}</button>
            </div>
          ));
      return (
          <div>
              <h1>All Posts</h1>
        {this.state.posts &&
          this.state.posts.map((post) => (
            <div className="userpost" class="flex flex-col">
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
                                {categoriesData}

      </div>
    );
  }
}
export default withRouter(AllPosts);
