import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import { connect } from 'react-redux';

import styles from './Base.css'

const Base = ( props ) => {
  return(
    <div className={ styles.pageContainer } >
      <Header location={ props.history.location } />
        
            { renderRoutes( props.route.routes ) }
      
      <Footer />
    </div>
  );
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
});

export default connect(
  mapStateToProps
)( Base );