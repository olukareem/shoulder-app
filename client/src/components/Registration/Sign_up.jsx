import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    //   errors: "",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  redirect = () => {
    this.props.history.push("/");
  };

  handleErrors = () => {
    return (
      <div>
        <ul>
          {this.state.errors.map((error) => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
      </div>
    );
  };

  render() {
    const { username, email, password } = this.state;
    const { handleRegister, history, currentUser } = this.props;
    return (
      <div>
        {" "}
        <ul
          class="py-16 max-w-full m-auto "
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            flexFlow: "column wrap",
            textAlign: "center",
          }}
        >
          <li>
            <h1
              style={{
                textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                color: "#322e3b",
                fontFamily: "Helvetica",
                fontSize: "4.8vw",
              }}
            >
              Become a member
            </h1>
          </li>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister(this.state);
            }}
          >
            <li
              style={{
                position: "relative",
                padding: "1.733vw",
                fontSize: "1.667vw",
              }}
            >
              <input
                placeholder="username"
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "4.067vw",
                  borderRadius: "0.8vw",
                  textIndent: "1.067vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                }}
              />
            </li>
            <li
              style={{
                position: "relative",
                padding: "1.733vw",
                fontSize: "1.667vw",
              }}
            >
              <input
                placeholder="email"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "4.067vw",
                  borderRadius: "0.8vw",
                  textIndent: "1.067vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                }}
              />
            </li>
            <li
              style={{
                position: "relative",
                padding: "1.733vw",
                fontSize: "1.667vw",
              }}
            >
              <input
                placeholder="password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                style={{
                  width: "44.4vw",
                  height: "4.067vw",
                  borderRadius: "0.8vw",
                  textIndent: "1.067vw",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.48)",
                }}
              />
            </li>
            {/* <input
            placeholder="password confirmation"
            type="password"
            name="password_confirmation"
            value={password_confirmation}
            onChange={this.handleChange}
          /> */}
            <li class="p-10 md:p-10 sm:p-10">
              <button
                placeholder="submit"
                type="submit"
                class="font-medium text-white"
                style={{
                  fontFamily: "Helvetica",
                  height: "3.933vw",
                  width: "9.967vw",
                  fontWeight: "550",
                  fontSize: "1.617vw",
                  borderRadius: "0.8vw",
                  background: "#85c0be",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                }}
              >
                Join
              </button>
            </li>
          </form>
          <div>{this.state.errors ? this.handleErrors() : null}</div>
        </ul>
      </div>
    );
  }
}
export default Signup;
