import React, { Component } from 'react';
import Header from './Header'
import MessageList from './MessageList'
import ChatForm from './ChatForm'
import './styles.css'
import UsersList from './UsersList'
import Peer from "simple-peer";

class Chat extends Component {
  constructor(props){
    super();
    props.socket.emit('joinRoom', {room:props.room})

    this.userVideo = React.createRef();
    this.partnerVideo = React.createRef();

    this.state = {
      login:props.login,
      socket:props.socket,
      membersNum:0,
      room:props.room,
      messages:[],
      users:[],
      stream:false,
      caller:false,
      callerSignal:false,
      callAccepted:false,
      peer:false

    };
  }

  componentDidMount(){
    this.state.socket.on("hey", (data) => {
      this.setState({caller:data.from});
      this.setState({callerSignal:data.signal});
      let date = new Date();
      let id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
      this.setState({messages:[...this.state.messages, {id:id, author:this.state.login, msg:'Вам звонит ', time:date, type:true}]})
    });

    this.state.socket.on('sendMsg', data=>{
      this.setState({messages:[...this.state.messages, data]})
    });

    this.state.socket.on('info', data=>{
      this.setState({membersNum:data.membersNum})
      this.setState({users:data.users})
    });
  }

  setCameraOn = (id, callback) => {
    this.setState({isStreamOn:true});
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.setState({stream:stream});
      if (this.userVideo.current) {
          this.userVideo.current.srcObject = stream;
          callback(id, stream);
      }
    })
  }

  disconnectCall = () =>{
    this.state.stream.getTracks().forEach((track) => {
        track.stop();
    });
    this.setState({callAccepted:false})
    this.setState({stream:false})
    this.state.peer.destroy();
  }

  callPeer = (id, stream1) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream1,
    });

    peer.on("signal", data => {
      this.state.socket.emit("callUser", { userToCall: id, signalData: data, from: this.state.socket.id });
    });

    this.setState({peer:peer})
    peer.on("stream", stream => {
      if (this.partnerVideo.current)
        this.partnerVideo.current.srcObject = stream;
    });

    this.state.socket.on("callAccepted", signal => {
      this.setState({callAccepted:true});
      peer.signal(signal);
    });

    peer.on('error', (err) => {
      this.disconnectCall();
    });

    peer.on('close', () => {
      this.disconnectCall();
    });
  }

  acceptCall = (id,stream1) => {
   this.setState({callAccepted:true});
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream1,
    });
    peer.on("signal", data => {
      this.state.socket.emit("acceptCall", { signal: data, to: this.state.caller });
    })
    this.setState({peer:peer})
    peer.on("stream", stream => {
      this.partnerVideo.current.srcObject = stream;
    });
    peer.on('error', (err) => {
      this.disconnectCall();
    })

    peer.on('close', () => {
      this.disconnectCall();
    })

    peer.signal(this.state.callerSignal);
  }

  render() {
    let partnerVideo, chatClass;
    if(this.state.callAccepted){
      partnerVideo = (<div className="container video">
              <div className="row justify-content-md-center">
              <video className="col-xl-auto partnerVideo" playsInline ref={this.partnerVideo} autoPlay />
              </div>
              </div>)
      chatClass = 'smallChat'
    }else {
      chatClass = 'bigChat'
    }
    let userVideo = this.state.stream && <div><video className="myVideo" playsInline  muted ref={this.userVideo} autoPlay /><button type="button" onClick={()=>this.disconnectCall()} className="disconnectButton btn btn-danger" >Отключиться</button></div>

    return (
      <div>
        <Header membersNum={this.state.membersNum} socket={this.state.socket}/>
        <div className="main" >
          <div className="chat">
            {userVideo} {partnerVideo}
            <MessageList  chatClass={chatClass} {...this.state} getCall={()=>{this.setCameraOn(null,this.acceptCall)}}/>
            <UsersList func={(id)=>{
              this.setState({callTo:[id]});
              this.setCameraOn(id,this.callPeer);
            }
            } {...this.state}/>
            <ChatForm {...this.state}/>
          </div>
        </div>
      </div>
    )
  }
}
export default Chat
