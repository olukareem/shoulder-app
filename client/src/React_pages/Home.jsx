import React, { Component } from "react";
import axios from 'axios'

import { Link, useHistory, Redirect } from "react-router-dom";

const Home = (props) => {

    const handleClick = () => {
        props.handleLogout()
        props.history.push('/')
    }

      const history = useHistory();

    
      
  return (
      
      <div class="py-16">
          {props.currentUser && <Redirect to={`/profile/${props.currentUser.id}`}/>}
          <h1 style={{ paddingBottom: "10.667vh", fontSize: "8.333vw", fontFamily: "Helvetica", fontWeight: "normal", textShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", textAlign: "center", color: "#322e3b"

 }}>It's okay to ask for help.</h1>
      <p class="text-center"style={{fontSize: "3.333vh", fontFamily: "Helvetica Neue", color: "#322e3b"}}>
        Shoulder is a place to talk, share resources and find support. <br></br> We'll
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
