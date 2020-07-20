import React, { Component } from "react";
import axios from "axios";

import { Link, useHistory, Redirect } from "react-router-dom";

const Home = (props) => {
  const handleClick = () => {
    props.handleLogout();
    props.history.push("/");
  };

  const history = useHistory();

  return (
    <div class="py-16 max-w-full m-auto block text-center">
      {props.currentUser && (
        <Redirect to={`/profile/${props.currentUser.id}`} />
      )}
      <h1
        style={{
          paddingBottom: "7.667vh",
          fontSize: "8.333vw",
          fontFamily: "Helvetica",
          fontWeight: "normal",
          textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
          textAlign: "center",
          color: "#322e3b",
        }}
      >
        It's okay to ask for help.
      </h1>
      <p
        class="text-center font-normal"
        style={{
          paddingBottom: "80px",
          fontSize: "1.833vw",
          fontFamily: "Helvetica Neue",
          color: "#322e3b",
        }}
      >
        Shoulder is a place to talk, share resources and find support. <br></br>{" "}
        We'll help you get there.
      </p>
      <Link
        to="/signup"
        class="inline-block"
        style={{
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
          width: "29.733vw",
          height: "8.15vw",
          borderRadius: "16px",
          background: "#85c0be",
        }}
      >
        <button
          type="button"
          class=""
          style={{
              color: "#fff",
            fontSize: "3.5vw",
            fontWeight: "bold",
            fontFamily: "Helvetica",
          }}
        >
          Get started
        </button>
      </Link>
      <br></br>
      <p
        class="font-normal text-center"
        style={{
          height: "3.333vw",
          fontSize: "2.267vw",
          fontFamily: "Helvetica",
        }}
      >
        Already a member?
      </p>
      <Link
        to="/login"
        class="h-12 font-medium text-center"
        style={{
          fontSize: "2.267vw",
          fontFamily: "Helvetica",
          color: "#85c0be",
        }}
      >
        Sign in
      </Link>
      <br></br>
      {props.loggedInStatus ? (
        <Link to="/logout" onClick={handleClick}>
          Log Out
        </Link>
      ) : null}
    </div>
  );
};
export default Home;
