import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_NOT_DONE = 'SET_NOT_DONE';
export const SET_DONE = 'SET_DONE'

export const CHECK_AUTH = 'CHECK_AUTH';
export const SIGN_OUT = 'SIGN_OUT';

export const GET_BARS = 'GET_BARS';
export const RESET_RESULTS = 'RESET_RESULTS';
export const GET_ATTENDING_COUNT = 'GET_ATTENDING_COUNT';
export const GET_ATTENDING_COUNT_GROUP = 'GET_ATTENDING_COUNT_GROUP';

export const INITIALIZE_STATE = 'INITIALIZE_STATE';
export const SET_IS_GOING = 'SET_IS_GOING';
export const SET_IS_NOT_GOING = 'SET_IS_NOT_GOING';

export const SHOW_MODAL = 'SHOW_MODAL';

export const checkAuth = () => {
  return ( dispatch ) => {
    const cookie = new Cookies();
    const authCookie = cookie.get('realcookie0202');
    axios.defaults.headers.common['Authorization'] = 'JWT ' + authCookie;
    axios.get( '/nightlife-app/auth' )
    .then( response => {
      if( !response.data.auth ){
        dispatch({
          type: CHECK_AUTH,
          isAuthorized: false,
        });
      }
      else{
        dispatch({
          type: CHECK_AUTH,
          isAuthorized: true,
          userDisplayName: response.data.displayName,
          userId:  response.data.userId
        });
      }
    })
    .catch( error => {
      console.log( error );
    })
  }
}

export const getBars = ( location ) => {
  return ( dispatch ) => {
    axios.post( '/nightlife-app/search/' + location )
    .then( response => {
      dispatch({
        type: GET_BARS,
        bars: response.data,
        location: location,
      })
    })
    .catch( error => {
      console.log( '...' );
    });
  }
}

export const resetResults = () => ({
  type: RESET_RESULTS,
  bars: null,
  addedBars: false,
})

export const getAttendingCountGroup = ( bars, userId ) => {
  return ( dispatch ) => {
    axios({
      method: 'POST',
      url:'/nightlife-app/getattendingcountbars',
      data:{
        bars:   bars,
        userId: userId
      },
    })
    .then( response => {
      dispatch({
        type: GET_ATTENDING_COUNT_GROUP,
        barsBeingAttended: response.data.barsBeingAttended,
        placesYouAreGoing: response.data.userBarList,
        addedBars: true
      });
    })
    .catch( error => {
      console.log( error );
    });
  }
}

export const setGoing = ( userId, itemId, count ) => {
  return ( dispatch ) => {
    const url = '/nightlife-app/set-is-going?itemId=' + itemId + '&userId=' + userId + '&count=' + count.toString();
    axios.post( url )
    .then( response => {
      dispatch({
        type: SET_IS_GOING,
        placesYouAreGoing: response.data.userBarList,
        barCounts: response.data.bars.barCounts,
        itemId: itemId,
      })
    })
    .catch( error => {
      console.log( error );
    });
  }
}

export const setNotGoing = ( userId, itemId, count ) => {
  return ( dispatch ) => {
    const url = '/nightlife-app/set-is-not-going?itemId=' + itemId + '&userId=' + userId + '&count=' + count.toString();
    axios.post( url )
    .then( response => {
      dispatch({
        type: SET_IS_NOT_GOING,
        placesYouAreGoing: response.data.userBarList,
        barCounts: response.data.bars.barCounts,
        itemId: itemId,
      })
    })
    .catch( error => {
      console.log( error );
    })
  }
}

export const showModal = ( bool ) => ({
  type: SHOW_MODAL,
  bool: bool,
})

export const loginAction = ( location, bars ) => {
  
}

export const signOut = () => {
  return ( dispatch ) => {
    let cookie = new Cookies();
    document.cookie = 'realcookie0202' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/nightlife-app;';
    document.cookie = 'locationCookie' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/nightlife-app;';
    cookie.remove('realcookie0202','',{
      path: '/nightlife-app',
      secure: 'true',
    });
    cookie.remove('locationCookie','',{
      path: '/nightlife-app',
      secure: 'true',
    });
    
    setTimeout( () => {
        axios.get( '/nightlife-app/signout' )
      .then( response => {
        dispatch({
          type: SIGN_OUT,
        });
      })
      .catch( error => {
        console.log( error );
      });
    }, 1000);
  }
}


