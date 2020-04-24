import React from 'react'

function Header(props){
  return (
    <header className="page-header">
      <div className="container ">
        <div className="row">
        <div className="col-sm-10">
          <h4>Онлайн: {props.membersNum}</h4>
        </div>
        <div className="col-sm-2">
          <button type="button" className="btn btn-danger but float-right" onClick={()=>{
            props.socket.disconnect();
            location.pathname = '/';
          }}>Выйти</button>
        </div>
    </div></div>
  </header>
  )

}

export default Header
