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

class App extends Component {


  componentDidMount() {
 
    this.onListenForPages();
  }
  onListenForPages = () => {
    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      // .limitToLast(this.props.limit)
      .on('value', snapshot => {
        this.props.onSetMessages(snapshot.val());
      });
  };


  render() {
    const { users, messages } = this.props;
    return (
      <div className="App">
        {/* <header id="header" className="fixed-top">
          <div className="container">
            <div className="logo float-left">
             <button className="btn btn-info">Admin Login</button>
            </div>

            <nav className="main-nav float-right d-none d-lg-block">
              <ul>
                <li className="active"><a href="#intro">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#team">Team</a></li>
                <li className="drop-down"><a href="">Drop Down</a>
                  <ul>
                    <li><a href="#">Drop Down 1</a></li>
                    <li className="drop-down"><a href="#">Drop Down 2</a>
                      <ul>
                        <li><a href="#">Deep Drop Down 1</a></li>
                        <li><a href="#">Deep Drop Down 2</a></li>
                        <li><a href="#">Deep Drop Down 3</a></li>
                        <li><a href="#">Deep Drop Down 4</a></li>
                        <li><a href="#">Deep Drop Down 5</a></li>
                      </ul>
                    </li>
                    <li><a href="#">Drop Down 3</a></li>
                    <li><a href="#">Drop Down 4</a></li>
                    <li><a href="#">Drop Down 5</a></li>
                  </ul>
                </li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </nav>
            
          </div>
         </header> */}

         <Router>
        <div>
          <h2>React</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
          { authUser ? (
               ''
              ) : (
                  <button className="btn-info float-right"><Link to={'/login'} className="nav-link">Admin Login</Link></button>
            )}
            
            <li><Link to={'/'} className="nav-link"> Home </Link></li>
            { 
              messages.map((message) => {
                return (
                <li><Link to={'/'} className="nav-link"> {message.title} </Link></li>
                
                )})
            }
            {/* <li><Link to={'/'} className="nav-link"> Home </Link></li>
            <li><Link to={'/contact'} className="nav-link">Contact</Link></li>
            <li><Link to={'/about'} className="nav-link">About</Link></li> */}
          </ul>
          </nav>
          <hr />
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/contact' component={Contact} />
              <Route path='/about' component={About} />
              <Route path='/login' component={AdminLogin} />
              <Route path='/pages' component={Pages} />
              <Route path='/addPage' component={AddPage} />
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
  withAuthentication,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(App);


// export default withAuthentication(App);
