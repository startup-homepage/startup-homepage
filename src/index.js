'use strict';

import React from 'react';
import Router from 'react-router';
import Routes from './components/Routes';
import Main from './components/Main';
import './sass/main.scss';

module.exports = function(route, data, callback){

    Router.run(Routes, route, (Handler) => {
      var html = React.renderToString(React.createElement(Handler, data));
      callback(null, html)
    })
  }
