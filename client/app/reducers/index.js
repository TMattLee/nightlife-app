import { combineReducers } from 'redux';
import * as actions from '../actions/index.js';

const initialState ={
  isAuthorized:       false,
  done:               false,
  bars:               null,
  redirect:           false,
  message:            "",
  userDisplayName:    null,
  userId:             null,  
  barsBeingAttended:  null,
  placesYouAreGoing:  null,
  addedBars:          false,
  showLoadingModal:   false,
  location:           null,
};

function currentState( state=initialState,actions ){
  switch( actions.type ){
    case 'CHECK_AUTH':
      return Object.assign( {}, state, {
        isAuthorized:         actions.isAuthorized,
        userDisplayName:      actions.userDisplayName,
        userId:               actions.userId,
      });
      
    case 'GET_BARS':
      return Object.assign( {}, state, {
        bars:         actions.bars,
        location:     actions.location,
      });
      
    case 'RESET_RESULTS':
      return Object.assign( {}, state, {
        bars:         actions.bars,
        addedBars:    actions.addedBars
      });
      
    case 'GET_ATTENDING_COUNT_GROUP':
      return Object.assign( {}, state, {
        barsBeingAttended: actions.barsBeingAttended,
        placesYouAreGoing: actions.placesYouAreGoing,
        addedBars:    actions.addedBars
      });
      
    case 'SET_IS_GOING':
      return Object.assign( {}, state, {
        placesYouAreGoing: actions.placesYouAreGoing,
        barsBeingAttended: Object.assign( {}, state.barsBeingAttended, {
          barCounts: actions.barCounts
        })
      });
      
    case 'SET_IS_NOT_GOING':
      return Object.assign( {}, state, {
        placesYouAreGoing: actions.placesYouAreGoing,
        barsBeingAttended: Object.assign( {}, state.barsBeingAttended, {
          barCounts: actions.barCounts
        })
      })
      
    case 'SHOW_MODAL':
      return Object.assign( {}, state, {
        showLoadingModal: actions.bool
      })
      
    case 'SIGN_OUT':
      return Object.assign({}, state, initialState );
      
    default:
      return state;
  }
} 

const reducers = combineReducers({
 currentState
});

export default reducers;