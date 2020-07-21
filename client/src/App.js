import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";
import {
  loginUser,
  verifyUser,
  registerUser,
  removeToken,
} from "./services/auth";
import {
  getUsers,
  getPosts,
  getCategories,
  addPost,
} from "./services/apihelper";
// import "./App.css";
import Header from "./components/Header/Header.jsx";
import Home from "./React_pages/Home.jsx";
import Login from "./components/Registration/Login.jsx";
import Signup from "./components/Registration/Sign_up.jsx";
import User_Profile from "./React_pages/User_Profile";
import CreatePost from "./components/Post/CreatePost.jsx";
import Categories from "./React_pages/Categories";
// import CategoryDropDown from "./components/Create Post/CategoryDropDown";

class App extends Component {
  state = {
    users: null,
    userData: {
      username: "",
      password: "",
    },
    currentUser: null,
    posts: null,
  };

  componentDidMount = async () => {
    const currentUser = await verifyUser();
    this.setState({
      currentUser,
    });
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
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      userData: {
        ...prevState.userData,
        [name]: value,
      },
    }));
  };

  handleAdd = async (postData) => {
    const newPost = await addPost(postData);
    this.setState((prevState) => ({
      posts: [...prevState.posts, newPost],
    }));
      window.location.reload(false)
  };

  loginSubmit = async (userData) => {
    const currentUser = await loginUser(userData);
    this.setState({
      currentUser,
    });
  };

  handleLogout = () => {
    this.setState({
      currentUser: null,
    });
    localStorage.removeItem("authToken");
    removeToken();
    this.props.history.push("/");
  };

  handleRegister = async (userData) => {
    const currentUser = await registerUser(userData);
    this.setState({ currentUser });
    this.props.history.push(`/profile/${currentUser.id}`);
  };

    render() {
//         var obj = {};
//         const username =(this.state.users && 
//             this.state.users.map((user) => (
//                 user.username
//             )));
//         const userId =
//    (this.state.users &&     this.state.users.map((user) => (
//             user.id
//    )))
//    const user =
//    (this.state.users &&     this.state.users.map((user) => (
//             user
//    )))
        
//         const postUserId = 
//         this.state.posts &&
//             this.state.posts.user_id.map((post) => (
//              Array.post.forEach.call(postUserId, num => {
//                 return num
//             })
//             ))
        
    

//      // console.log(this.state.users.findIndex(postUserId))
//         console.log(userId)
//         console.log(postUserId)
//         console.log(username)
//         // console.log(user.get(postUserId.get(0)))
//         console.log(userId == postUserId ? ({username}) : null)
    return (
      <div class="h-screen, m-0, p-0">
        <Header
          handleChange={this.handleChange}
          userData={this.state.userData}
          handleLogin={this.loginSubmit}
          currentUser={this.state.currentUser}
          handleLogout={this.handleLogout}
        />
        <div class="mt-28 px-12 ">
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                handleLogout={this.handleLogout}
                loggedInStatus={this.state.isLoggedIn}
                currentUser={this.state.currentUser}
              />
            )}
          />

          <Route
            exact
            path="/login"
            render={(props) => (
              <Login
                {...props}
                loginSubmit={this.loginSubmit}
                loggedInStatus={this.state.isLoggedIn}
              />
            )}
          />

          <Route
            exact
            path="/signup"
            render={(props) => (
              <Signup
                {...props}
                handleChange={this.handleChange}
                userData={this.state.userData}
                handleRegister={this.handleRegister}
                currentUser={this.state.currentUser}
              />
            )}
          />
          <Route exact path="/mentors">
            {this.state.users &&
              this.state.users.map((user) => (
                <div className="user">
                  <Link to={`/user/${user.id}`}>
                    <h2>{user.username}</h2>
                    <img src={user.url} />
                  </Link>
                </div>
              ))}
          </Route>

          <Route
            exact
            path="/posts"
                    render={(props) => <User_Profile {...props}
                    userData={this.state.userData}
                    />}
          >
            {this.state.posts &&
              this.state.posts.map((post) => (
                <div className="userpost" class="flex flex-col">
                  <Link to={`/users/${post.id}`}></Link>
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                      <p>{post.body}</p>
                      <p>Posted by <Link to={`/user/${post.user_id}`}>

                          {post.user.username}
                          </Link></p>
                  <p>Created at {post.created_at}</p>
                  <p>Last Updated {post.updated_at}</p>
                </div>
              ))}
           
          </Route>

          <Route
            exact
            path="/profile/:id/"
            render={(props) => (
              <User_Profile {...props} currentUser={this.state.currentUser} />
            )}
          ></Route>

          <Route
            exact
            path="/post/new"
            render={(props) => (
              <CreatePost
                {...props}
                handleAdd={this.handleAdd}
                currentUser={this.state.currentUser}
              />
            )}
          />

    

          <Route
            exact
            path="/category/:id"
            render={(props) => <Categories {...props} />}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
