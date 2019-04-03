import React, { Component } from 'react';
import { withAuthentication } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';

class About extends Component {

  componentDidMount() {
    let pageId = this.props.match.params.id;
    this.props.firebase
      .messages()
      .orderByChild('title')
      .equalTo(pageId)
      .on('value', snapshot => {
        this.props.onSetMessages(snapshot.val());
      });
      
  }

  render() {
    const { messages } = this.props;
    return (
        <div>
          {messages.map((message) => {
                return (
                  message.title
                )})
          }
        </div>
    );
  }
  
}

const mapStateToProps = state => ({
  
  authUser: state.sessionState.authUser,
  messages: Object.keys(state.messageState.messages || {}).map(
    key => ({
      ...state.messageState.messages[key],
      uid: key,
    }),
  ),
  limit: state.messageState.limit,
});

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages =>
    dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

// const About = ({ match }) => (
//   <div>
//     <h3>ID: {match.params.id}</h3>
//   </div>
// )

export default compose(
  withFirebase,
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(About);
