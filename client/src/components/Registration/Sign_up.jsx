import React, { Component } from 'react';
import axios from 'axios'

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: ''
     };
  }
    
handleChange = (event) => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
};
    
    
handleSubmit = (event) => {
    event.preventDefault()
    const {username, email, password, password_confirmation} = this.state
    let user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }
axios.post('http://localhost:3001/users', {user}, {withCredentials: true})
    .then(response => {
      if (response.data.status === 'created') {
        this.props.handleLogin(response.data)
        this.redirect()
      } else {
        this.setState({
          errors: response.data.errors
        })
      }
    })
    .catch(error => console.log('api errors:', error))
  };

  redirect = () => {
    this.props.history.push('/')
  }
    
  handleErrors = () => {
    return (
      <div>
        <ul>{this.state.errors.map((error) => {
          return <li key={error}>{error}</li>
        })}
        </ul> 
      </div>
    )
  }

    render() {
    const {username, email, password, password_confirmation} = this.state
    return (
        <div>
          <h1>Become a member</h1>
         <form onSubmit={this.handleSubmit}>
            <input
              placeholder="username"
              type="text"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <input
              placeholder="email"
              type="text"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <input 
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <input
              placeholder="password confirmation"
              type="password"
              name="password_confirmation"
              value={password_confirmation}
              onChange={this.handleChange}
            />
          
            <button placeholder="submit" type="submit">
              Join
            </button>
        
          </form>
          <div>
            {
              this.state.errors ? this.handleErrors() : null
            }
          </div>
        </div>
      );
    }
  }
export default Signup;
  


// export default function Register(props) {
//   return (
//     <div className="register">
//       <form onSubmit={props.handleRegister}>
//         <div className="pair">
//           <label htmlFor='username'>Username</label>
//           <input name='username' type='text' value={props.userData.username} onChange={props.handleChange} />
//         </div>

//         <div className="pair">
//           <label htmlFor='password'>Password</label>
//           <input name='password' type='password' value={props.userData.password} onChange={props.handleChange} />
//         </div>

//         <input type='submit' value="Register" />
//       </form>
//     </div>
//   )
// }