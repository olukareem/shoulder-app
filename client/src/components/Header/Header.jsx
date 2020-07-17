import React, { Component } from "react";
import {Link} from "react-router-dom"

export default class Header extends Component {
  state = {};

  render() {
    return (
      <>
        <header>
          {this.props.currentUser ? (
                    <nav>
                        <Link to="/">shoulder</Link>
              <h2>Hello {this.props.currentUser.username}!</h2>
              <h2>Posts</h2>
                        <Link to="/members">Members</Link>
                        <Link to="/categories">Categories</Link>
                        <button onClick={this.handleLogout}>Log Out</button>
                        <h2>Profile</h2>

            </nav>
                ) : (
                     
                        
                        <div className="login">
                            <nav>
                            <Link to="/">shoulder</Link>

              <h2>Posts</h2>
                        <Link to="/members">Members</Link>
                        <Link to="/categories">Categories</Link>
                        <Link to="/login">Log in</Link>
                        <Link to="/signup">Sign Up</Link>
                            </nav>
                            
              <form onSubmit={this.props.handleLogin}>
                <div className="pair">
                  <label htmlFor="username">Username</label>
                  <input
                    name="username"
                    type="text"
                    value={this.props.userData.username}
                    onChange={this.props.handleChange}
                  />
                                </div>
                                

                                
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
              </form>
            </div>
          )}
        </header>
      </>
    );
  }
}
