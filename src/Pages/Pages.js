import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import MessageList from './MessageList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthorization, withEmailVerification } from '../Session';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;
var moment = require('moment');


class Pages extends Component {
  constructor(props) {
    super(props);
    
    this.onRemovePage = this.onRemovePage.bind(this);
    this.onEditPage = this.onEditPage.bind(this);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.messages.length) {
      this.setState({ loading: true });
    }

    this.onListenForPages();
  }

  componentDidUpdate(props) {
    if (props.limit !== this.props.limit) {
      this.onListenForPages();
    }
  }

  onListenForPages = () => {
    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      // .limitToLast(this.props.limit)
      .on('value', snapshot => {
        this.props.onSetMessages(snapshot.val());

        this.setState({ loading: false });
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onRemovePage(uid) {
    this.props.firebase.message(uid).remove();
  };

  onEditPage(uid) {
    console.log(this.props.firebase.message(uid));
  };

  render() {
    const { users, messages } = this.props;
    const { loading } = this.state;
    const style = {
      'padding':'15px'
    }
    return (
      <div className="container">
      <div className="row">
      <div style={style}>
        <span><Link to={'/addPage'} className="btn btn-primary">Add Page</Link></span>
      </div>
      <div className="col-md-12">
      
      {loading && <div>Loading ...</div>}
        <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>Page</th>
                <th>Description</th>
                <th>Status</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            { 
              messages.map((message) => {
                return (
                <tr key={message.uid}>
                  <td>{message.title}</td>
                  <td>{message.description}</td>
                  <td>{message.status}</td>
                  <td>{moment(message.updatedAt).format('MM/DD/YYYY')}</td>
                  <td> 
                    <button onClick={this.onEditPage(message.uid)}>
                      Edit
                  </button>|
                  <button  onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.onRemovePage(message.uid) } }>
                      Delete
                  </button>
                  </td>
                </tr> 
                )})
            }
            </tbody>
         </table>
            
        {!messages && <div>There are no messages ...</div>}
      </div>
      </div>
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

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Pages);
