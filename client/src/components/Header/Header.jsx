import React, { Component } from "react";
import { Link } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { getCategories } from "../../services/apihelper";

export default class Header extends Component {
    state = {
        categories: []
    };
    
    componentDidMount = async () => {
        const categories = await getCategories()
        this.setState({
            categories
        })

    }
    


  render() {
    return (
      <>
        <header class="fixed, w-auto top-0, left-0, h-28, py-10 px-12 shadow-md" style={{ boxShadow: "0px 1px 15px 1px rgba(0,0,0,0.75);" }}>
          {this.props.currentUser ? (
                    <nav>
                        <ul class="list-none flex flex-wrap justify-between">
              <li class="text-6xl ..., font-sans, h-20 text-teal-500"><Link to="/">shoulder</Link></li>
              {/* <h2>Hello {this.props.currentUser.username}!</h2> */}
              <li class="inline-block "><Link to="/posts">All Posts</Link></li>
              <li><Link to="/mentors">Members</Link></li>
              {/* <Link to="/categories">Categories</Link> */}
              <li><DropdownButton id="dropdown-basic-button" title="Categories">
                            <Dropdown.Item href="/categories">All Categories</Dropdown.Item>
                            {this.state.categories.map(category => (
                            <Dropdown.Item href={`/category/${category.id}`}>
                            {category.name}
                          </Dropdown.Item>
                            ))}
                            
              </DropdownButton></li>
                            {/* <Link to="/profile/:id">Profile</Link> */}
                            
              <li class=""><DropdownButton id="dropdown-basic-button" title="Profile">
                <Dropdown.Item href="/profile/:id">Your Profile</Dropdown.Item>
                <Dropdown.Item href="/post/new">New Post</Dropdown.Item>
              </DropdownButton></li>
              <li><button  onClick={this.props.handleLogout}>Log Out</button></li>
            </ul>
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
                <DropdownButton id="dropdown-basic-button" title="Categories">
                            <Dropdown.Item href="/categories">All Categories</Dropdown.Item>
                            {this.state.categories.map(category => (
                            <Dropdown.Item href={`/category/${category.id}`}>
                            {category.name}
                          </Dropdown.Item>
                            ))}
                            
              </DropdownButton>
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
