import React from 'react'

export default function Message(props){

  let time, myTime = new Date(), msgTime = new Date(props.time);

  if(myTime.toDateString() ===  msgTime.toDateString())
    time = msgTime.toLocaleTimeString();
  else
    time = msgTime.toLocaleDateString();

  if(props.owner)
    return (
      <div className="chat-log__item chat-log__item--own">
        <h3 className="chat-log__author">{props.author}<small>{time}</small></h3>
        <div className="chat-log__message">{props.msg}</div>
      </div>
    )

  if(props.type)
    return (
      <div className="chat-log__item">
        <h3 className="chat-log__author"><small>{time}</small></h3>
        <div className="chat-log__message">{props.msg}<b>{props.author}</b></div>
        <button type="button" className="btn btn-success" onClick={()=>props.func()}>Принять звонок</button>
      </div>
    )

  return (
    <div className="chat-log__item">
      <h3 className="chat-log__author">{props.author} <small>{time}</small></h3>
      <div className="chat-log__message">{props.msg}</div>
    </div>
  )
}
