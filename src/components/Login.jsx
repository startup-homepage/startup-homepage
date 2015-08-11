'use strict';


import React from 'react/addons';
import ReactMixin from 'react-mixin';
import Auth from '../services/AuthService';

class Login extends React.Component {

  constructor () {
    super()
    this.state = {
      user: '',
      password: ''
    };
  }

  login(e) {
      console.log(e);
      e.preventDefault();


    }

    render() {
      return (
        <div className="login jumbotron center-block">
          <h1>Login</h1>
          <form role="form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" valueLink={this.linkState('user')} className="form-control" id="username" placeholder="Username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" valueLink={this.linkState('password')} className="form-control" id="password" ref="password" placeholder="Password" />
          </div>
          <div className="btn btn-default" onClick={this.login.bind(this)}>Submit</div>
        </form>
      </div>
      );
    }
}

export default Login

ReactMixin(Login.prototype, React.addons.LinkedStateMixin)
