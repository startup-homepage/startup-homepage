'use strict';

import React from 'react';
import {RouteHandler} from 'react-router';
import Header from './Header';

class Main extends React.Component {

   constructor (props) {
       super(props)
       title: props.string
   }

   safeStringify (obj) {

     return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
     
   }

   render () {

     let initialProps = {
       __html: this.safeStringify(this.props)
     }

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
            </div>
            <script
              id='initial-props'
              type='application/json'
              dangerouslySetInnerHTML={initialProps} />
       </body>
       </html>);
  }
}

export default Main;
