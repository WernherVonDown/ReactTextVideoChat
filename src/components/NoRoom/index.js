import React from 'react';
import {Link} from "react-router-dom"


export default function NoRoom (){
    return (
        <div className="container">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <div className="card form-holder">
          <div className="card-body">
          <h5>Комнаты с таким именем не существует.</h5>
          <Link to='/login'><input type="submit" className="btn btn-primary" value="Регистрация"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
}
