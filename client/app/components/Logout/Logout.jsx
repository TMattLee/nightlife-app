import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Logout = ( props ) => {
  return <Redirect to="/nightlife-app/" />
}

export default connect()( Logout );
