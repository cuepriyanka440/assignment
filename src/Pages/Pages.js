import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthentication } from '../Session';
import { Link } from 'react-router-dom';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import CommonCheck from '../CommonCheck';
import parse from 'html-react-parser';
import Truncate from 'react-truncate';

import _ from 'lodash';

var moment = require('moment');

class Pages extends Component {
  constructor(props) {
    super(props);
    
    this.onRemovePage = this.onRemovePage.bind(this);
    this.sortby = this.sortby.bind(this);
    this.state = {
      loading: false,
      pages:null,
      sortOrder:'asc',
      filterText:null,
      paginationObj : null
    };
  }

  componentDidMount() {
    if (!this.props.pages.length) {
      this.setState({ loading: true });
    }

    this.onListenForPages();
    if(!this.props.pages)
      return null;
    
  }

  onListenForPages = () => {
    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      .on('value', snapshot => {
        this.props.onSetPages(snapshot.val());
        this.setState({ loading: false });

        let messag = snapshot.val();
        let msg= Object.keys(messag || {}).map(
          key => ({
            ...messag[key],
            uid: key,
          }),
        )
        this.setState({pages:msg });
        let msg1= this.getPaginatedItems(msg, 1, 3);
        this.props.onSetPages(msg1.data);
        this.setState({paginationObj:msg1 });
        
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onRemovePage(uid) {
    this.props.firebase.message(uid).remove();
  };

  sortby(sortKey){
    
    let sortedObject = _.orderBy(this.props.pages, sortKey, this.state.sortOrder)
    this.props.onSetPages(sortedObject);
    if( this.state.sortOrder === 'asc') {
      this.setState({ sortOrder: 'desc' });
    } else {
      this.setState({ sortOrder: 'asc' });
    }
  }

  getPaginatedItems(items, page, pageSize) {
    var pg = page || 1,
      pgSize = pageSize || 100,
      offset = (pg - 1) * pgSize,
      pagedItems = _.drop(items, offset).slice(0, pgSize);
    return {
      page: pg,
      pageSize: pgSize,
      total: items.length,
      total_pages: Math.ceil(items.length / pgSize),
      data: pagedItems
    };
  }
  
  onNextPage(page) {
	  
	  let msg1 = this.getPaginatedItems(this.state.pages, page, 3);
	
    this.props.onSetPages(msg1.data);
    this.setState({paginationObj:msg1 });
  }
  onChangeFilter = (event) => {
    this.setState({filterText:event.target.value});
  }
  onSeach = () => {
    this.setState({pages:this.props.pages });
    var sortedObject;
    if(  this.state.filterText === '') {
      sortedObject = this.state.messages;
    } else {
      sortedObject = _.filter(this.props.pages, { 'title': this.state.filterText });
    }
    this.props.onSetMessages(sortedObject);
  }

  render() {
    if(!this.props.authUser){
     return <CommonCheck/>
    }
    const { pages } = this.props;
    const { loading,filterText } = this.state;
    const paginationObj = this.state.paginationObj;
    if(!paginationObj){
      return null;
    }
    const items = []
	  let selected='';
	
	 for (var i = 1; i <= paginationObj.total_pages; i++) {
		selected = 'page-item';
		if(paginationObj.page === i) {
			selected = 'page-item active';
		} 
    const s=i;
    // eslint-disable-next-line 
		items.push(<li className={selected} key={i}><a className="page-link" onClick={(i) => this.onNextPage(s)}>{i}</a></li>)
		
	}
    const style = {
      'padding':'15px'
    }
    const marginStyle = {
      'margin' : '10px'
    }
    
    return (
      <div className="container">
       <div className={this.props.infoMessage ? 'alert alert-success' : ''}>{this.props.infoMessage}</div>
      <div className="row">
      <div style={style}>
        <span><Link to={'/addPage'} className="btn btn-primary">Add Page</Link></span>
        <input type="text" style={marginStyle} placeholder="Filter by title" onChange={this.onChangeFilter} value={filterText}></input>
        <button onClick={this.onSeach}>Search</button>
      </div>
     
      <div className="col-md-12">
      
      {loading && <div>Loading ...</div>}
        <table className="table">
            <thead className="thead-dark">
              <tr>
                <th><a onClick={(e) => { this.sortby('title') } }>
                        Page</a></th>
                <th><a onClick={(e) => { this.sortby('description') } }>Description</a></th>
                <th><a onClick={(e) => { this.sortby('status') } }>Status</a></th>
                <th><a onClick={(e) => { this.sortby('updatedAt') } }>Updated At</a></th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            { 
              pages.map((page1) => {
               
                return (
                <tr key={page1.title}>
                  <td>{page1.title}</td>
                  <td>
                  <Truncate lines={1} ellipsis={<span>...</span>}>
                      {parse(page1.description)}
                  </Truncate>
                  </td>
                  <td>{page1.status}</td>
                  <td>{moment(page1.updatedAt).format('MM/DD/YYYY')}</td>
                  <td> 
                    <Link to={'editPage/' + page1.title} className="nav-link"><i className="fa fa-edit" aria-hidden="true"></i></Link>
                    <a onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.onRemovePage(page1.title) } }>
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </a>
                    <Link to={'/preview/'+page1.title} className="nav-link"> Preview </Link>
                  </td>
                </tr> 
                )})
            }
            </tbody>
         </table>
            <div>
			
			<nav aria-label="Page navigation example">
				  <ul className="pagination justify-content-center">
				  {items}
				  </ul>
				</nav>
			</div>
        {!pages && <div>There are no pages ...</div>}
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
  infoMessage: state.pageState.infoMessage,
});

const mapDispatchToProps = dispatch => ({
  onSetPages: pages =>
    dispatch({ type: 'PAGES_SET', pages }),
});

export default compose(
  withFirebase,
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Pages);
