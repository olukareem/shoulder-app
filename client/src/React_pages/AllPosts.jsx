import React, { Component } from "react";
import { withRouter, Link, Route } from "react-router-dom";
import { getUsers, getPosts, getCategories } from "../services/apihelper";
import Moment from "react-moment";

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
    return (
      <div class="py-2 max-w-full" style={{ margin: "0 19.667vw" }} className="Contains-All">
        <h1
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            textAlign: "center",
            textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
            color: "#322e3b",
            fontFamily: "Helvetica",
            fontSize: "4.8vw",
          }}
        >
          All Posts
        </h1>
        {this.state.posts &&
          this.state.posts.map((post) => (
            <div style={{ padding: "1.3vw 2.667vw" }}>
              <ul
                style={{
                  backgroundColor: "#F8F8F8",
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  flexFlow: "row wrap",
                  textAlign: "left",
                  alignItems: "center",
                  justifyContent: "center",
                  // width: "44.4vw",
                  height: "20.067vw",
                  borderRadius: "0.8vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                  paddingTop: "1.067vw",

                  paddingLeft: "2.067vw",
                  paddingRight: "2.067vw",
                  overflow: "scroll",
                }}
              >
                <li style={{ width: "100%" }}>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#000",
                      fontSize: "1.4vw",
                      padding: "0.267vw 0 0.757vw",
                      lineHeight: "1.2vw",
                    }}
                  >
                    {post.title}
                  </p>
                  <hr style={{ border: "1px solid #DDDDDD" }}></hr>
                </li>
                <li style={{ padding: "0.767vw 0", width: "100%" }}>
                  <p
                    style={{
                      color: "#747474",
                      fontWeight: "350",
                      fontSize: "0.833vw",
                    }}
                  >
                    <strong>Description: </strong>
                    {post.description}
                  </p>
                </li>
                <hr style={{ border: "1px solid #DDDDDD", width: "100%" }}></hr>
                <li style={{ padding: "0.767vw 0", width: "100%" }}>
                  <p class="font-light" style={{ fontSize: "0.733vw" }}>
                    {post.body}
                  </p>
                </li>
                <hr style={{ border: "1px solid #DDDDDD", width: "100%" }}></hr>

                <li style={{ padding: "0.267vw 0", width: "100%" }}>
                  <p style={{ fontSize: "0.633vw", color: "#747474" }}>
                    <strong>
                      Created by:&nbsp;
                      <strong style={{ fontSize: "0.70vw" }}>
                        {post.user.username}&nbsp;
                      </strong>
                    </strong>{" "}
                    on&nbsp;
                    <Moment format="MMM D YYYY" withTitle>
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
<strong style={{color: "#747474",
                      fontSize: "0.783vw", width: "100%", padding: ".5vw 0",}}>Categories:</strong>
                <li
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    padding: "0.267vw ",
                              width: "100%",
                    // justifyContent:"space-between"
                  }}
                >
                  {post.categories.map((category) => (
                    <button
                      style={{
                              padding: ".7vw .9vw",
                          margin: ".27vw",
                        alignSelf: "center",
                        fontFamily: "Helvetica",
                              height: "auto",
                        width: "13%",
                        fontWeight: "550",
                        fontSize: "0.667vw",
                        borderRadius: "0.66vw",
                        background: "#A391A3",
                        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                      }}
                    >
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
