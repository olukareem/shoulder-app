import React, { Component } from "react";
import { getOneCategory, addPost, getPosts } from "../services/apihelper";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "../assets/post-table.scss";

export default class Categories extends Component {
  state = {
    category: null,
  };
  componentDidMount = async () => {
    const category = await getOneCategory(this.props.match.params.id);
    this.setState({
      category,
    });
    const posts = await getPosts();
    this.setState({
      posts,
    });
  };

  render() {
    const createdBy =
      this.state.posts &&
      this.state.posts.map((post) => (
        <div>
          <p className="Post-Info">
                    <strong>
                      Created by:&nbsp;
                      <strong style={{ fontSize: "0.70vw" }}>
                      <Link to={`/member/${post.user_id}`}>{post.user.username}</Link>&nbsp;
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
        </div>
      ));
    return (
      <div class="py-2 max-w-full" className="Contains-All">
        {this.state.category && (
          <div>
            <h1 className="Post-Page-Title">
              Category: {this.state.category.name}
            </h1>
            {this.state.category.posts.map((post) => (
              <div className="State-div">
                <ul className="Table-Flex-Contain">
                  <li style={{ width: "100%" }}>
                    <p className="Post-Title">{post.title}</p>
                    <hr className="Table-Divide"></hr>
                  </li>
                  <li style={{ padding: "0.767vw 0", width: "100%" }}>
                    <p
                      className="Post-Description"
                    >
                      <strong>Description: </strong>
                      {post.description}
                    </p>
                  </li>
                  <hr
                    className="Table-Divide"
                  ></hr>
                  <li style={{ padding: "0.767vw 0", width: "100%" }}>
                    <p class="font-light" className="Post-Body">
                      {post.body}
                    </p>
                  </li>
                  <hr
                    className="Table-Divide"
                  ></hr>

                  <li style={{ padding: "0.767vw 0", width: "100%" }}>
                    {createdBy}

                    
                  </li>
                  <hr
                    className="Table-Divide"
                  ></hr>

                  <li style={{ padding: "0.767vw 0", width: "100%" }}>
                    <p></p>
                  </li>
                </ul>
              </div>
            ))}
                </div>
                
            )}
            
      </div>
    );
  }
}
