import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
//import axios from "axios";

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
  addPost, updatePost
} from "./services/apihelper";
// import "./App.css";
import Header from "./components/Header/Header.jsx";
import Home from "./React_pages/Home.jsx";
import Login from "./components/Registration/Login.jsx";
import Signup from "./components/Registration/Sign_up.jsx";
import CurrentUser from "./React_pages/CurrentUser";
import CreatePost from "./components/Post/CreatePost.jsx";
import Categories from "./React_pages/Categories";
import AllPosts from "./React_pages/AllPosts";
import EditPosts from "./components/Post/EditPosts"
import MemberPosts from "./React_pages/MemberPosts.jsx"
import Members from "./React_pages/Members";
import SinglePost from "./React_pages/SinglePost";
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
    window.location.reload(false);
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
    this.props.history.push(`/profile/${currentUser.username}`);
  };

    editPosts = async (id, postData) => {
        const updated = await updatePost(id, postData);
        this.setState((prevState) => ({
            posts: prevState.posts.map(oldPost => oldPost.id === updated.id ? updated : oldPost)
        }))
    };

  

  render() {

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
                <Route exact path="/members"
                    render={( props ) => (
                <Members
                            {...props}
                            users={this.state.users}
                />)}
     
          />



          <Route
            //All User posts
            exact
            path="/posts"
            render={(props) => (
              <AllPosts {...props} userData={this.state.userData} />
            )}
          />

          <Route
            //Current User posts

            exact
            path="/profile/:id/"
            render={(props) => (
              <CurrentUser
                {...props}
                currentUser={this.state.currentUser}
                userData={this.state.userData}
                handleSubmit={this.handleSubmit}
                handleUpdate={this.onUpdate}
                items={this.state.items}
                onUpdate={this.handleUpdate}
              />
            )}
                ></Route>
                
                <Route
            //Other User posts

            exact
            path="/member/:id/"
            render={(props) => (
              <MemberPosts
                {...props}
                currentUser={this.state.currentUser}
                userData={this.state.userData}
              />
            )}
                ></Route>

<Route
            //One Post

            exact
            path="/member/:id/post/:id"
            render={(props) => (
              <SinglePost
                {...props}
                currentUser={this.state.currentUser}
                userData={this.state.userData}
              />
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
        <Route path='/posts/:id/edit' render={(props) => {
          const { id } = props.match.params;
          return <EditPosts
            {...props}
            editPosts={this.editPosts}
            id={id}
          />
        }} />

<Route
            exact
            path="/category/:id"
                    render={(props) => <Categories {...props}
                    userData={this.state.userData}
                    />}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
