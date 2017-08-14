import React from 'react';
import { connect } from 'react-redux';
import styles from './BarItem.css';

import { getAttendingCount } from '../../actions/index.js';
import { setGoing } from '../../actions/index.js';
import { setNotGoing } from '../../actions/index.js';

const BarItem = ( props ) => {
  
  let barHasLoaded = false;
  let isAttendingThisBar = false;
  
  if ( props.barsBeingAttended && props.barsBeingAttended.barCounts[ props.itemId ] ){
    barHasLoaded = true;
  }
  
  if( props.placesYouAreGoing && props.placesYouAreGoing[ props.itemId ] === true){
    isAttendingThisBar = true;
  }
  
  const setGoingHandler = ( event ) => {
    event.preventDefault();
    let count = props.barsBeingAttended.barCounts[ props.itemId ];
    props.setGoing( props.userId, props.itemId, count );
  }
  
  const setNotGoingHandler = ( event ) => {
    event.preventDefault();
    let count = props.barsBeingAttended.barCounts[ props.itemId ];
    props.setNotGoing( props.userId, props.itemId, count );
  }
  
  const checkForCount = () => {
    if( barHasLoaded ){
      return  props.barsBeingAttended.barCounts[ props.itemId ];
    } 
    else {
      return 0;
    }
  }
  
  return <div className={ styles.barContainer } > 
    <div className={ styles.barBorder }>
      <img src={ props.img } className={ styles.barImage } />
      <div className={ styles.barInfo } >
        <div className={ styles.barName } > { props.name } </div>
        <div className={ styles.barRating } > 
          { props.rating } / 5 
          <img className={ styles.star }
            src="/nightlife-app/dist/assets/images/star.svg" /> 
        </div>
        <div className={ styles.goingContainer} >
          <div className={ styles.goingCount } >
            {
              checkForCount()
            }
          </div>
          <div className={ styles.text } >
            GOING
          </div> 
        </div>
      </div>
      <div className={ styles.barAddress } >
        <div> { props.location.display_address[0] } </div>
        <div> { props.location.display_address[1] } </div>
      </div>
      <div className={ styles.goingIndicator }>
       {
         !props.isAuthorized ?   <div></div>  :  
          <div className={ isAttendingThisBar ? styles.isGoing : styles.isNotGoing /*{ backgroundColor: 'lime' } : { backgroundColor: 'gray' }*/ } >
            {
              isAttendingThisBar ? 
              
              <div onClick={ setNotGoingHandler.bind( props ) } >GOING</div>
              
              :
              
              <div onClick={ setGoingHandler.bind( props ) } >GOING</div>
  
            }
          </div>
       }
      </div>
    </div>
  </div>
  
}



const mapStateToProps = ( state ) => ({
  bars:               state.currentState.bars,
  barsBeingAttended:  state.currentState.barsBeingAttended,
  done:               state.currentState.done,
  isAuthorized:       state.currentState.isAuthorized,
  userId:             state.currentState.userId,
  placesYouAreGoing:  state.currentState.placesYouAreGoing,
});

const mapDispatchToProps = ( dispatch ) => ({
  //getAttendingCount: ( itemKey, itemId ) => dispatch( getAttendingCount( itemKey, itemId ) ),
  setGoing: ( itemKey, itemId, count ) => dispatch( setGoing( itemKey, itemId, count ) ),
  setNotGoing: ( itemKey, itemId, count ) => dispatch( setNotGoing( itemKey, itemId, count ) ),
});


export default connect( mapStateToProps, mapDispatchToProps )( BarItem );