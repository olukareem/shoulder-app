import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { getUsers, getPosts, getCategories, getOnePost } from "../services/apihelper";
import Moment from "react-moment";
import "../assets/post-table.scss";
class AllPosts extends Component {
  state = {
    posts: null,
      users: {
          id: "",
      username: "",
      },
    //   categories: null,
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
    const userpost = await getOnePost();
    this.setState({
      userpost,
    });

    const categoriesData = await getCategories();

    this.setState({
      categories: categoriesData,
    });
  };
  render() {
    return (
      <div class="py-2 max-w-full" className="Contains-All">
        <h1 className="Post-Page-Title">All Posts</h1>
        {this.state.posts &&
          this.state.posts.map((post, users,) => (
            <div className="State-div">
              <ul className="Table-Flex-Contain">
                <li>
                  <p className="Post-Title"><Link to={`/member/${users.id}/post/${post.id}`}>{post.title}                  
                        </Link></p>
                  <hr className="Table-Divide"></hr>
                </li>
                <li style={{ padding: "0.767vw 0" }}>
                  <p className="Post-Description">
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
                    <strong>
                      Created by:&nbsp;
                      <strong style={{ fontSize: "0.70vw" }}>
                        <Link to={`/member/${post.user_id}`}>
                          {post.user.username}
                        </Link>
                        &nbsp;
                      </strong>
                    </strong>{" "}
                    on&nbsp;
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
            </div>
          ))}
      </div>
    );
  }
}
export default withRouter(AllPosts);
