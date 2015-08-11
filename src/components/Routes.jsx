'use strict';

import React from 'react';
import {Route, DefaultRoute} from 'react-router';

import Main from './Main'
import Home from './Home';
import Login from './Login';
import Signup from './Signup';


const Routes = (
  <Route handler={Main} path="/">
    <DefaultRoute handler={Home} />
    <Route name="login/" handler={Login} />
    <Route name="signup/" handler={Signup} />
  </Route>
);

export default Routes;
