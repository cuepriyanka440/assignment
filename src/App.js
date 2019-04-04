import React, { Component } from 'react';

import './App.css';
import './bootstrap.min.css';
import Home from './frontend/Home';
import About from './frontend/About';
import Contact from './frontend/Contact';
import AdminLogin from './Admin/AdminLogin';
import Pages from './Pages/Pages';
import AddPage from './Pages/AddPage';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withAuthentication } from './Session';
import { withFirebase } from './Firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import EditPage from './Pages/EditPage';

class App extends Component {

  componentDidMount() {
    this.onListenForPages();
  }
  onListenForPages = () => {
    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      .on('value', snapshot => {
        this.props.onSetMenus(snapshot.val());
      });
  };

  render() {
    const { users, menus } = this.props;
    console.log(this.props.authUser);
    return (
      <div className="App">
         <Router>
        <div>
          <h2>React</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
          {this.props.authUser ? (
            <button type="button" class="btn btn-secondary" onClick={this.props.firebase.doSignOut}>
            Sign Out
          </button>
          ) : (
            <button className="btn-info float-right"><Link to={'/login'} className="nav-link">Admin Login</Link></button>
            
          )}
           
          { this.props.authUser ? (
           <li><Link to={'/pages'} className="nav-link"> Manage Pages </Link></li>
          ) : (
            ''
          )}
          { 
              menus.map((menu) => {
                return (
                <li><Link to={'/app/'+menu.title} className="nav-link"> {menu.title} </Link></li>
                
                )})
            }
          </ul>
          </nav>
          <hr />
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={AdminLogin} />
              <Route path='/pages' component={Pages} />
              <Route path='/addPage' component={AddPage} />
              <Route path='/editPage/:id' component={EditPage} />
              <Route path='/app/:id' component={About} />
              <Route component={Page404} />
          </Switch>
        </div>
      </Router>
      </div>
    );
  }
}

const Page404 = ({ location }) => (
  <div>
     <h2>No match found for <code>{location.pathname}</code></h2>
  </div>
);

const mapStateToProps = state => ({
  
  authUser: state.sessionState.authUser,
  menus: Object.keys(state.messageState.menus || {}).map(
    key => ({
      ...state.messageState.menus[key],
      uid: key,
    }),
  ),
});

const mapDispatchToProps = dispatch => ({
  onSetMenus: menus =>
    dispatch({ type: 'MENUS_SET', menus }),
});

export default compose(
  withFirebase,
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);