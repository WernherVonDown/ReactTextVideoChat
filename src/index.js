import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {Route, Redirect, Switch, BrowserRouter} from "react-router-dom"
import Login from './components/Login'

ReactDOM.render(
  <BrowserRouter>
  <Switch>
      <Route path='/room/:roomId' component={App}/>
      <Route exact path='/login' component={Login}/>
      <Redirect from="/" to="/login" />
    </Switch>
</BrowserRouter>,
document.getElementById('root')
);
//
// ReactDOM.render(
//     <App/>,
//   document.getElementById('root')
// );
