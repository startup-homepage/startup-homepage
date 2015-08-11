'use strict';

import React from 'react';
import Router from 'react-router';
import Routes from './components/Routes';
import Main from './components/Main';
import './sass/main.scss';

if (typeof document !== 'undefined') {
  var initialProps = JSON.parse(document.getElementById('initial-props').innerHTML)
  Router.run(Routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createElement(Handler, initialProps), document)
  })
}

module.exports = function(route, data, callback){

    
    Router.run(Routes, route, (Handler) => {
      var html = React.renderToString(React.createElement(Handler, data));
      callback(null, html)
    })
  }
