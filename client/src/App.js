import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";
import {
  loginUser,
  verifyUser,
  registerUser,
  removeToken,
} from "./services/auth";
import { getUsers, getPosts, getCategories } from "./services/apihelper";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Home from "./React_pages/Home.jsx";
import In_Home from "./React_pages/In_Home.jsx";
import Login from "./components/Registration/Login.jsx";
import Signup from "./components/Registration/Sign_up.jsx";
import User_Profile from "./React_pages/User_Profile";

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
    return (
      <div>
        <Header
          handleChange={this.handleChange}
          userData={this.state.userData}
          handleLogin={this.loginSubmit}
          currentUser={this.state.currentUser}
          handleLogout={this.handleLogout}
        />

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

        {/* <Route
          exact
          path="/posts"
          render={(props) => <User_Profile {...props} />}
            >
                 {this.state.posts &&
            this.state.posts.map((post) => (
              <div className="userpost">
                <Link to={`/users/${post.id}`}>
                  
                    </Link>
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <p>{post.body}</p>
                    <p>{post.created_at}</p>
                    <p>{post.updated_at}</p>
              </div>
            ))}
            </Route> */}

        <Route
          exact
          path="/profile/:id"
          render={(props) => (
            <User_Profile {...props} currentUser={this.state.currentUser} />
          )}
        ></Route>

        <Route exact path="/categories">
          {this.state.categories &&
            this.state.categories.map((category) => (
              <div className="category">
                <Link to={`/category/${category.name}`}>
                  <h2>{category.name}</h2>
                </Link>
              </div>
            ))}
        </Route>
      </div>
    );
  }
}

export default withRouter(App);
