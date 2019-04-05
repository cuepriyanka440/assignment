import React, { Component } from 'react';
import { withAuthentication } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

class Content extends Component {

  constructor(){
    super();
    this.state ={
      pageId:null
    }
  }
  componentDidMount() {
    let PageId = this.props.match.params.id;
    this.setState({pageId:PageId});
    this.onListenForPages(PageId);
  }
  onListenForPages = (pageId) => {
    this.props.firebase
      .messages()
      .orderByChild('title')
      .equalTo(pageId)
      .on('value', snapshot => {
        this.props.onSetMessage(snapshot.val());
      });
  };

  componentDidUpdate(props) {
    let PageId = this.props.match.params.id;
    if(PageId != this.state.pageId ) {
      this.setState({pageId:PageId});
      this.onListenForPages(PageId);
    }
  }

  componentWillUnmount() {
    this.props.firebase.message().off();
  }

  render() {
    const { message } = this.props;
    if(!message[0]) {
      return null;
    }
    if(!this.props.authUser && message[0].status == 'draft' ) {
      this.props.history.push('/login');
    }

    return (
        <div>
          {message.map((msg) => {
                return (
                  parse(msg.description)
                )})
          }
        </div>
    );
  }
  
}

const mapStateToProps = state => ({
  
  authUser: state.sessionState.authUser,
  message: Object.keys(state.messageState.message || {}).map(
    key => ({
      ...state.messageState.message[key],
      uid: key,
    }),
  ),
});

const mapDispatchToProps = dispatch => ({
  onSetMessage: message =>
    dispatch({ type: 'MESSAGE_SET', message }),
});

export default compose(
  withFirebase,
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Content);
