import React, { useEffect, useRef} from 'react'
import Message from './Message'

export default function MessageList (props){
  const chatContainer = useRef(null);

  const chatMessages= props.messages.map((message, index) =><li key={message.id}>
    <Message author={message.author} msg={message.msg} time={message.time} type={message.type} owner={!!(message.author===props.login && !message.type)} func={()=>props.getCall()}/>
    </li>)
    let scrollToMyRef = () => {
      const scroll =
        chatContainer.current.scrollHeight -
        chatContainer.current.clientHeight;
        chatContainer.current.scrollTo(0, scroll);
    };

    useEffect(()=>{
      scrollToMyRef()
    })



  return (
    <div className={`container ${props.chatClass} chatBack`}  ref={chatContainer}>
  <div className="chat-log" >
  {chatMessages} <div />
  </div>
</div>
  )
}
