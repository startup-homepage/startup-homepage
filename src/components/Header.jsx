'use strict';

import React from 'react';
import {Link} from 'react-router';

class Header extends React.Component {

  render() {
    return (<header>
      <Link to="/">Home</Link>
      <Link to="/login/">Login</Link>
      <Link to="/signup/">Signup</Link>
    </header>)
  }

}

export default Header;
