import React, { Component } from "react";
import axios from 'axios'

import { Link, useHistory, Redirect } from "react-router-dom";

const Home = (props) => {

    const handleClick = () => {
        axios.delete('http://localhost:3000/logout', {withCredentials: true})
        .then(response => {
          props.handleLogout()
          props.history.push('/')
        })
        .catch(error => console.log(error))
      }

      const history = useHistory();

    
      
  return (
      
      <div>
          {props.currentUser && <Redirect to={`/profile/${props.currentUser.id}`}/>}
      <h1>It's Okay to ask for help.</h1>
      <p>
        Shoulder is a place to talk, share resources and find support. We'll
        help you get there.
      </p>
          <Link to="/signup">Get started</Link>
          <br></br>
          <p>Already a member?</p>
          <Link to="/login">Sign in</Link>
      <br></br>
          { 
        props.loggedInStatus ? 
        <Link to='/logout' onClick={handleClick}>Log Out</Link> : 
        null
      } 
    </div>
  );
};
export default Home;
