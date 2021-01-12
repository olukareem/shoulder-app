import React, { Component } from "react";
import { getUserPosts, getUsers } from "../services/apihelper";
import { withRouter, Link } from "react-router-dom";
import "../assets/post-table.scss";
import Moment from "react-moment";

class MemberPosts extends Component {
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
    const users = await getUsers();
    this.setState({
      users,
    });
    const id = this.props.match.params.id;
    const posts = await getUserPosts(id);
    this.setState({
      posts,
    });
    if (this.props.post) this.setFormData();
  };

  render() {
    return (
      <div class="py-2 max-w-full" className="Contains-All">
        {this.state.posts &&
          this.state.posts.slice(0,1).map((post) => (
            <h1 className="Post-Page-Title">{post.user.username}'s Posts</h1>
          ))}

        {this.state.posts &&
                this.state.posts.map((post) => (
              
                    <div className="State-div">
              <ul className="Table-Flex-Contain">
                <li>
                  <p className="Post-Title">{post.title}</p>
                  <hr className="Table-Divide"></hr>
                </li>
                <li style={{ padding: "0.767vw 0" }}>
                  <p className="Post-Description">
                    <strong>Description: </strong>
                    {post.description}
                  </p>
                </li>                <hr className="Table-Divide"></hr>
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

export default withRouter(MemberPosts);
