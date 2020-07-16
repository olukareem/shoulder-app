import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { getUsers } from "./services/apihelper";
import "./App.css";
import Homepage from "./React_pages/Homepage.jsx";

function App() {
  return (
      <div>
          <Switch>
              <Route exact path="/" component={Homepage} />
              </Switch>
    </div>
  );
}
export default App;
