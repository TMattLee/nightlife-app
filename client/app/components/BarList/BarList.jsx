import React from 'react';
import { connect } from 'react-redux';
import BarItem from '../BarItem/BarItem.jsx';

import { getAttendingCountGroup } from '../../actions/index.js';


const BarList = ( props ) => {
  
  if( !props.bars ){
    return <div>
    </div>
  }
  
  if( props.bars && !props.addedBars ){
    props.getAttendingCountGroup( props.bars, props.userId )
    return <div >
    </div>
  }
  const bars = props.bars.map( ( value, key ) => {
    return <div key={ key } >
      <BarItem 
        itemKey={ key }
        itemId={ value.id }
        name={ value.name } 
        img={ value.image_url }
        location={ value.location } 
        count={  value.count || null }
        rating={ value.rating } />
    </div>
  })
  return <div > 
    { bars }
  </div>
}

const mapStateToProps = ( state ) => ({
  bars:               state.currentState.bars,
  addedBars:          state.currentState.addedBars,
  userId:             state.currentState.userId,
  barsBeingAttended:  state.currentState.barsBeingAttended,
});

const mapDispatchToProps = ( dispatch ) => ({
  getAttendingCountGroup: ( bars, userId ) => dispatch( getAttendingCountGroup( bars, userId ) ),
});

export default connect( mapStateToProps, mapDispatchToProps )( BarList );