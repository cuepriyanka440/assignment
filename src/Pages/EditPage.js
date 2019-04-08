import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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
      status:null,
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
        this.props.onSetPage(snapshot.val());
        let message = snapshot.val();
        let message1 =  Object.keys(message || {}).map(
          key => ({
            ...message[key],
            uid: key,
          }),
        )
        let message2 = message1[0];
        if(!message2) {
          return null
        }
        this.setState({title:message2.title });  
        this.setState({description:message2.description });  
        this.setState({status:message2.status }); 
        this.setState({pageId:message2.uid });   
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
  
  onSaveEditText = (event) => {
    event.preventDefault();
    this.onEditPage(
      this.state.title,
      this.state.description,
      this.state.status,
      this.state.pageId
    );
  };

  onEditPage = (title, description, status, pageId) => {
    this.props.firebase.message(pageId).set({
      title,
      description,
      status,
      updatedAt: moment().format(),
    });
    this.props.onSetSetInfoMessage('Page updated successfully.');
    this.props.history.push('/pages');
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
     const { title, description,status} = this.state;
    
    const style = {
      'padding': '15px'
    }
    let message = this.props.page[0];
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
                  this.onSaveEditText(event)
                }
              >
                <input
                  type="text"
                  value={title}
                  placeholder="Title"
                  className="form-control"
                  required
                  onChange={this.onChangeText}
                />
                <br></br>

                <FroalaEditor
                  model={description}
                  onModelChange={this.handleModelChange}
                />
                <br></br>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="status"
                    value='draft'
                    checked={status === 'draft'}
                    onChange={this.onChangeStatus} />
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    Draft
          </label>
                </div>
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="status"
                    value='published'
                    checked={status === 'published'}
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
  pages: Object.keys(state.pageState.pages || {}).map(
    key => ({
      ...state.pageState.pages[key],
      uid: key,
    }),
  ),
  page: Object.keys(state.pageState.page || {}).map(
    key => ({
      ...state.pageState.page[key],
      uid: key,
    }),
  ),
  
});

const mapDispatchToProps = dispatch => ({
  onSetPage: page =>
    dispatch({ type: 'PAGE_SET', page }),
  onSetSetInfoMessage: infoMessage =>
    dispatch({ type: 'INFOMESSAGE_SET', infoMessage }),
  
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(EditPage);
