import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  state = {};

  render() {
    return (
      <>
        <header style={{ border: "1px solid black " }}>
          {this.props.currentUser ? (
            <nav>
              <Link to="/">shoulder</Link>
              <h2>Hello {this.props.currentUser.username}!</h2>
              <h2>Posts</h2>
              <Link to="/mentors">Mentors</Link>
              <Link to="/categories">Categories</Link>
              <h2>Profile</h2>
              <button onClick={this.props.handleLogout}>Log Out</button>
            </nav>
          ) : (
            <div className="login">
              <nav>
                <Link to="/">shoulder</Link>

                <h2>Posts</h2>
                <Link to="/mentors">Mentors</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign Up</Link>
              </nav>
{/* 
              <form onSubmit={this.props.handleLogin}>
                <div className="pair">
                  <label htmlFor="username">Username</label>
                  <input
                    name="username"
                    type="text"
                    value={this.props.userData.username}
                    onChange={this.props.handleChange}
                  /> */}
                {/* </div>

                <div className="pair">
                  <label htmlFor="password">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={this.props.userData.password}
                    onChange={this.props.handleChange}
                  />
                </div>

                <input type="submit" value="Login" />
              </form> */}
            </div>
          )}
        </header>
      </>
    );
  }
}
