import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthorization, withEmailVerification } from '../Session';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import CommonCheck from '../CommonCheck';

import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;
var moment = require('moment');
class EditPage extends Component {
  constructor(props) {
    super(props);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.state = {
      title: '',
      description: '',
      loading: false,
      pageId:null,
      
    };
  }

  componentDidMount() {
    let pageId = this.props.match.params.id;
    this.props.firebase
      .messages()
      .orderByChild('title')
      .equalTo(pageId)
      .on('value', snapshot => {
        this.props.onSetMessage(snapshot.val());
      });
      this.setState({pageId:pageId });
  }


  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ title: event.target.value });
  };

  onChangeStatus = event => {
    this.setState({ status: event.target.value });
  }

  onCreateMessage = (event, authUser) => {

    event.preventDefault();
    this.props.firebase.messages().push({
      title: this.state.title,
      userId: authUser.uid,
      description: this.state.description,
      status: this.state.status,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    });

    this.setState({ title: '', description: '', status: '', category: '' });
    this.props.history.push('/pages');
  };

  onEditPage = (message, title, description, status) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      title,
      description,
      status,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  handleModelChange(model) {
    this.setState({
      description: model
    });
  }

  render() {
    if(!this.props.authUser){
      return <CommonCheck/>
     }
    const { users, messages } = this.props;
    const { title, description, loading, pageId } = this.state;
    const style = {
      'padding': '15px'
    }
    let message = this.props.message[0];
    if(!message) {
      return null
    } 
    return (
      <div className="container">
        <div className="row">
          <div style={style}>
            <span><Link to={'/pages'} className="btn btn-primary">Back</Link></span>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <form
                onSubmit={event =>
                  this.onEditPage(event, this.props.authUser)
                }
              >
                <input
                  type="text"
                  value={message.title}
                  placeholder="Title"
                  className="form-control"
                  required
                  onChange={this.onChangeText}
                />
                <br></br>

                <FroalaEditor
                  model={message.description}
                  onModelChange={this.handleModelChange}
                />
                <br></br>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="status"
                    value='draft'
                    checked={message.status === 'draft'}
                    onChange={this.onChangeStatus} />
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    Draft
          </label>
                </div>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="status"
                    value='published'
                    checked={message.status === 'published'}
                    onChange={this.onChangeStatus} />
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    Published
          </label>
                </div>
                <br></br>
                <button type="submit" className="btn btn-primary">Update Page</button>
              </form>
            </div>
          </div>
          <div className="col-md-6">
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
  onSetMessagesLimit: limit =>
    dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(EditPage);
