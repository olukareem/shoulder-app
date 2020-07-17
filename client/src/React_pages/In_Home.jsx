import React, { Component } from "react";
import axios from 'axios'

import { Link } from "react-router-dom";

const In_Home = (props) => {

    const handleClick = () => {
        axios.delete('http://localhost:3000/logout', {withCredentials: true})
        .then(response => {
          props.handleLogout()
          props.history.push('/')
        })
        .catch(error => console.log(error))
      }

  return (
    <div>
      <h1>It's Okay to ask for help.</h1>
      <p>
        Shoulder is a place to talk, share resources and find support. We'll
        help you get there.
      </p>

          { 
        props.loggedInStatus ? 
        <Link to='/logout' onClick={handleClick}>Log Out</Link> : 
        null
      }
    </div>
  );
};
export default In_Home;
