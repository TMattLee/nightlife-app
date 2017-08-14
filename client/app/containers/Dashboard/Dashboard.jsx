import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash'

const Dashboard = ( props ) => {
  return <div>
    this is where the dashboard goes
  </div>
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  username:           state.currentState.username,
  userId:             state.currentState.userId,
  polls:              state.currentState.polls,
  currentPoll:        state.currentState.currentPoll,
  showCreateModal:    state.currentState.showCreateModal,
  showEditModal:      state.currentState.showEditModal,
  showDeleteModal:    state.currentState.showDeleteModal,
});

export default connect(
  mapStateToProps
)( Dashboard );