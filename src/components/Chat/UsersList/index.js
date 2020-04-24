import React from 'react'
import callImage from './img/call.png'

export default function usersList (props){
  const listOfUsers= props.users.map((user) => {
    let but = props.socket.id === user.id ?<span style={{marginLeft:'10px',color:'red'}}>You</span>:<input type="image" src={callImage} className="call_input" id={user.id} onClick={(e)=>props.func(e.target.id)}/>;
    return <li  key={user.id} className="list-group-item">
  {user.login}
  {but}
  </li>})

  return (
    <ul className="list-group users_list">
      {listOfUsers}
    </ul>
  )
}
