import React, { Component } from "react";
import { Link } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { getCategories } from "../../services/apihelper";
import { css, cx } from "emotion";

export default class Header extends Component {
  state = {
    categories: [],
  };

  componentDidMount = async () => {
    const categories = await getCategories();
    this.setState({
      categories,
    });
  };

  render() {
    return (
      <>
        <header
          class="fixed, w-auto top-0, relative left-0, py-10 px-12 shadow-md flex flex-row justify-even"
          style={{
            height: "12.933vmin",
            boxShadow: "0px 1px 15px 1px rgba(0,0,0,0.75);",
          }}
        >
          <span
            class="pr-10 font-light"
            style={{
              fontSize: "5.333vmin",
              fontFamily: "Helvetica Neue",
              color: "#85C0BE",
            }}
          >
            <Link to="/">shoulder</Link>
          </span>
          {this.props.currentUser ? (
            <nav class="w-full text-center font-light">
              <ul
                class="list-none flex-shrink flex font-light justify-between"
                style={{
                  height: "3.933vmin",
                  fontSize: "1.2vw",
                  fontFamily: "Helvetica Neue",
                  color: "#322e3b",
                }}
              >
                {/* <li
                  class="bg-transparent font-light h-20"
                  style={{
                    fontSize: "2.333em",
                    fontFamily: "Helvetica Neue",
                    color: "#85C0BE",
                  }}
                >
                  <Link to="/">shoulder</Link>
                </li> */}
                {/* <h2>Hello {this.props.currentUser.username}!</h2> */}
                <li class="">
                  <Link to="/posts">All Posts</Link>
                </li>

                <li>
                  <Link to="/mentors">Members</Link>
                </li>
                {/* <Link to="/categories">Categories</Link> */}
                <li>
                  <ul>
                    <DropdownButton
                      id="dropdown-basic-button"
                      title="Categories &#x25BE;"
                    >
                      <li
                        class="bg-white relative block shadow-md text-left"
                        style={{
                          padding: "12px 16px",
                          zIndex: "99",
                          width: "inherit",
                          height: "inherit",
                          fontSize: "1.20rem",
                        }}
                      >
                        {this.state.categories.map((category) => (
                          <Dropdown.Item
                            class="hover:bg-gray-300"
                            className={css`
                              &:hover {
                                font-weight: 500;
                              }
                            `}
                            href={`/category/${category.id}`}
                          >
                            {category.name} <br />
                          </Dropdown.Item>
                        ))}
                      </li>
                    </DropdownButton>
                  </ul>
                </li>
                {/* <Link to="/profile/:id">Profile</Link> */}

                <form
                  class="relative"
                  action="action_page.php"
                  style={{ top: "-2px" }}
                >
                  <input
                    type="text"
                    placeholder="Search.."
                    name="search"
                    class="shadow-md  pl-10"
                    style={{
                      borderRadius: "6px",
                      textIndent: "15px",
                      width: "235px",
                      height: "2.733vw",
                    }}
                  />
                  <button
                    type="submit"
                    class="font-medium text-white"
                    style={{
                      fontSize: "100%",
                      fontFamily: "Helvetica",
                      height: "2.733vw",
                      width: "7.967vw",
                      borderRadius: "0.8vw",
                      background: "#85c0be",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    }}
                  >
                    submit
                  </button>
                </form>

                <li class="font-light " style={{ appearance: "none" }}>
                  <ul>
                    <DropdownButton
                      id="dropdown-basic-button"
                      title="Profile &#x25BE;"
                    >
                      <li
                        class="bg-white relative block shadow-md text-left"
                        style={{
                          padding: "12px 16px",
                          zIndex: "99",
                          width: "inherit",
                          height: "inherit",
                          fontSize: "1.20rem",
                        }}
                      >
                        <Dropdown.Item
                          href="/profile/:id"
                          className={css`
                            &:hover {
                              font-weight: 500;
                            }
                          `}
                        >
                          Your Profile
                          <br />
                        </Dropdown.Item>
                        <Dropdown.Item
                          href="/post/new"
                          class="text-left"
                          className={css`
                            &:hover {
                              font-weight: 500;
                            }
                          `}
                        >
                          New Post
                        </Dropdown.Item>
                      </li>
                    </DropdownButton>
                  </ul>
                </li>

                <li>
                  <button onClick={this.props.handleLogout}>Log Out</button>
                </li>
              </ul>
            </nav>
          ) : (
            //Conditional: Top is what will display when logged in. Bottom for new users.

            <div className="login">
              <nav>
                <Link to="/">shoulder</Link>

                <h2>Posts</h2>
                <Link to="/mentors">Mentors</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign Up</Link>
                <DropdownButton id="dropdown-basic-button" title="Categories">
                  <Dropdown.Item href="/categories">
                    All Categories
                  </Dropdown.Item>
                  {this.state.categories.map((category) => (
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
