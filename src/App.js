import React, { Component } from 'react';
import Login from './components/Login'
import {socket} from './socket'
import NoRoom from './components/NoRoom'

class App extends Component {
  constructor(props){
    super();
    this.state = {
      socket:socket,
      logged:false
    };
  }

  componentDidMount(){
      this.state.socket.emit('checkRoom', location.pathname)
      console.log(location.pathname)
    this.state.socket.on('checkRoom', data=>{
      this.setState({ logged: data})
    })
  }

  render() {
    console.log(this.state.logged)
     return this.state.logged?<Login room={location.pathname.replace('/room/', '')}/>:<NoRoom/>;
  };
}

export default App;
