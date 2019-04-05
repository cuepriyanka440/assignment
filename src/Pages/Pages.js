import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthentication } from '../Session';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import CommonCheck from '../CommonCheck';
import parse from 'html-react-parser';
import Truncate from 'react-truncate';

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
    if(!this.props.authUser){
     return <CommonCheck/>
    }
    const { users, messages } = this.props;
    const { loading } = this.state;
    const style = {
      'padding':'15px'
    }
    console.log(this.props);
    return (
      <div className="container">
       <div className={this.props.infoMessage ? 'alert alert-success' : ''}>{this.props.infoMessage}</div>
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
                  <td>
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                      {parse(message.description)}
                  </Truncate>
                  </td>
                  <td>{message.status}</td>
                  <td>{moment(message.updatedAt).format('MM/DD/YYYY')}</td>
                  <td> 
                    <Link to={'editPage/' + message.title} className="nav-link"><i class="fa fa-edit" aria-hidden="true"></i></Link>
                    <a  onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.onRemovePage(message.uid) } }>
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </a>
                    <Link to={'/preview/'+message.title} className="nav-link"> Preview </Link>
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
  infoMessage: state.messageState.infoMessage,
});

const mapDispatchToProps = dispatch => ({
  onSetMessages: messages =>
    dispatch({ type: 'MESSAGES_SET', messages }),
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

export default compose(
  withFirebase,
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Pages);
