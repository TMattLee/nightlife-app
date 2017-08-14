import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ReactLoading from 'react-loading';
import Cookies from 'universal-cookie';

import BarList from '../../components/BarList/BarList.jsx';
import styles from './HomePage.css';

import { getBars } from '../../actions/index.js';
import { checkAuth } from '../../actions/index.js';
import { resetResults } from '../../actions/index.js';
import { showModal } from '../../actions/index.js';

const HomePage = ( props ) =>  {
  const cookies = new Cookies();
  const cookieContent = cookies.get('locationCookie');
  const showLoadingModal = () => {
    props.showModal( true );
  }
  
  const hideLoadingModal = () => {
    props.showModal( false );
  }
  
  let isAuthorized = ( props.isAuthorized )
  props.checkAuth();
  
  if( cookieContent && isAuthorized ){
    cookies.remove('locationCookie');
    document.cookie = 'locationCookie' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/nightlife-app;';
    props.resetResults();
    showLoadingModal();
    props.getBars( cookieContent );
  }
  
  
  
  const locationSubmit = ( event ) =>  {
    event.preventDefault();
    event.stopPropagation();
    const location = event.target[0].value;
    props.resetResults();
    showLoadingModal();
    props.getBars( location );
  }
  
  
  if( props.addedBars ){
    hideLoadingModal()
  }
  return ( <div className={ styles.itemContainer } >
    <Modal 
      isOpen={ props.showLoadingModal } 
      contentLabel="Modal"
      onRequestClose={ hideLoadingModal } 
      shouldCloseOnOverlayClick={ false } 
      className={{
        base: styles.modalClass,
        afterOpen: styles.modalClassAfterOpen,
        beforeClose: styles.modalClassBeforeClose
      }}
      overlayClassName={{
        base: styles.modalOverlayClass,
        afterOpen: styles.modalOverlayClassAfterOpen,
        beforeClose: styles.modalOverlayClassBeforeClose,
      }}>
      
      <div>
        <ReactLoading type="cylon" color="#4389a7" height="200" width="200"  delay={ 100 } />
      </div>
    
    </Modal>
    <div className={ styles.containerSide } >
      <form onSubmit={ locationSubmit } encType="x-www-urlencode">
        {
          !props.isAuthorized ? <div  className={ styles.text } >
              Where are you now?
            </div> :
            <div className={ styles.text } > 
              Where are you now, { props.userDisplayName[0] }? 
            </div>
        }
        <input className={ styles.text } type="text" name="loc" placeholder="City, State or Zip Code" required /> 
        <button  className={ styles.text } type="submit"> GO </button>
      </form>
    </div>
    <div className={ styles.containerCenter } >
      <BarList /> 
    </div>
  </div>
  );
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  polls:              state.currentState.polls,
  currentPoll:        state.currentState.currentPoll,
  showLoadingModal:   state.currentState.showLoadingModal,
  hideLoadingModal:   state.currentState.hideLoadingModal,
  bars:               state.currentState.bars,
  location:           state.currentState.location,
  userDisplayName:    state.currentState.userDisplayName,
  addedBars:          state.currentState.addedBars,
});

const mapDispatchToProps = ( dispatch ) => ({
  getBars: ( location ) => dispatch( getBars( location ) ),
  checkAuth: () => dispatch( checkAuth() ),
  resetResults: () => dispatch( resetResults() ),
  showModal: ( bool ) => dispatch( showModal( bool ) ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( HomePage );