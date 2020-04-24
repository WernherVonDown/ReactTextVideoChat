import React, { useState } from 'react'

function ChatForm(props){
  const [msg, setMsg] = useState('');
  const [room] = useState("/room/"+props.room);

  let sendMessage = ()=>{
      if(msg.length)
      props.socket.emit('sendMsg', {text:msg, author:props.login, time:new Date(), room:room})
      setMsg('')
  }
  let _handleKeyDown = (e) => {
    if (e.key === 'Enter' && msg.length) {
      props.socket.emit('sendMsg', {text:msg, author:props.login, time:new Date(), room:room})
      setMsg('')
    }
  }
  return (
    <div className="chat-form">
  <div className="container ">
      <div className="row">
        <div className="col-sm-10 col-xs-8">
          <input type="text" value={msg} onKeyDown={_handleKeyDown} className="form-control" onChange={()=>{setMsg(event.target.value)}} placeholder="Сообщение" />
        </div>
        <div className="col-sm-2 col-xs-4">
          <button type="button" className="btn btn-success btn-block" onClick={()=>sendMessage()} >Отправить</button>
        </div>
      </div>
  </div>
</div>
  )

}

export default ChatForm
