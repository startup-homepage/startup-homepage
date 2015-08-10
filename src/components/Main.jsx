'use strict';

import React from 'react';
import {RouteHandler} from 'react-router';
import Header from './Header';

class Main extends React.Component {
  render() {

   return  (<html>
       <head>
         <title>{this.props.title}</title>
       </head>
       <body>
           <div className="container">
             <div className="row">
               <Header />
             </div>
             <RouteHandler {...this.props} />
             {this.props.children}!!!
           </div>
     </body>
     </html>);
  }
}

export default Main;
