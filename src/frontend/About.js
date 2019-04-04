import React, { Component } from 'react';
import { withAuthentication } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

class About extends Component {

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
        console.log(snapshot.val());
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
