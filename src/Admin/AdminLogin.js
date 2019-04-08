import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class AdminLogin extends Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/pages');
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { error } = this.state;
    return (
        <div  className="wrapper">
        <div id="formContent">
        <div className="fadeIn first">
          <h4>Login</h4>
        </div>
        {error && <p className="alert alert-danger">{error.message}</p>}
         <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input type="email" name="email" className="form-control" onChange={this.onChange} required id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" name="password" className="form-control" onChange={this.onChange} required id="exampleInputPassword1" placeholder="Password"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        </div>
    );
  }
}

export default compose(
  withRouter,
  withFirebase,
)(AdminLogin);







