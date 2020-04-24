import React, { Component } from 'react';
import {Route, Redirect, Switch, BrowserRouter} from "react-router-dom"
import {socket} from '../../socket'
import Chat from '../Chat'

class Login extends Component {
  constructor(props){
    super();
    this.state = {
      socket:socket,
      room:props.room?props.room:'',
      login:"",
      entered:false
    };
  }
  componentDidMount(){
    this.state.socket.emit("hello", "hi, server");
    this.state.socket.on("hello", data =>this.setState({ response: data}));
    this.state.socket.on('EnterRoom', data=>{
      this.setState({entered:data})
    })
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter' && this.state.login.length) {
      this.login()
    }
  }

  login = () => {
    if(this.state.login.length){
      let room = this.state.room?this.state.room:Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
      this.state.socket.emit("login", {room:room, login:this.state.login});
      this.setState({room:room})
    }
  }

  render() {
    let room = "/room/"+this.state.room;
  if(this.state.room && this.state.entered)
    return (<BrowserRouter>
    <Switch>
        <Route path='/room/:roomId' render={(props) => <Chat room={this.state.room} {...this.state} {...props} />}/>
        <Redirect from="/login" to={room} />
      </Switch>
  </BrowserRouter>)

    return (

        <div className="container">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <div className="card form-holder">
          <div className="card-body">
          {this.state.room?<h4>Введите ник, чтобы перейти в комнату <b>{this.props.room}</b></h4>: <h1>Login</h1>}
            <div className="form-group">
              <label>Username</label>
              <input type="text" onKeyDown={this._handleKeyDown} className="form-control" placeholder="Username" onChange={(event)=>this.setState({login:event.target.value})}/>
            </div>
            <div className="row">
              <div className="col-4 text-center">
                <input type="button" className="btn btn-primary" value="Войти" onClick={this.login}/>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    );
  };
}
export default Login
