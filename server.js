const express = require('express');
const bodyParser = require('body-parser')
const socket = require('socket.io');
const app = express();
const io = socket.listen(app.listen(1337));

const rooms = new Set(['/room/main']), users = {};

io.sockets.on('connection', (client) => {
  client.on('login', (data) => {
    users[client.id] = data.login;
    client.emit('EnterRoom', true);
  });

  client.on('sendMsg', (data)=>{
      let id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
      io.to(data.room).emit('sendMsg', {id:id,author:data.author, msg:data.text, time:data.time, type:false});
  });

  client.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  });

  client.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

  client.on('disconnecting', (data) => {
    let discUser = client.id,  userNames = [];
    for (key in client.rooms)
      if(rooms.has(key)){
          if(io.nsps['/'].adapter.rooms[key].length == 1)
            rooms.delete(key);
          else {
            for(userKey in io.nsps['/'].adapter.rooms[key].sockets)
              userKey  !== discUser && userNames.push({id:userKey, login:users[userKey]});
            delete users[discUser];
            io.to(key).emit('info', {membersNum: userNames.length, users:userNames});
          }
      }
    })

  client.on('joinRoom', (data)=>{
    let userNames = [];
    rooms.add(`/room/${data.room}`);
    client.join(`/room/${data.room}`);
    for(key in io.nsps['/'].adapter.rooms[`/room/${data.room}`].sockets)
      userNames.push({id:key, login:users[key]});
    io.to(`/room/${data.room}`).emit('info', {membersNum: userNames.length, users:userNames});
  });

  client.on('checkRoom', (data) => {
    if(io.nsps['/'].adapter.rooms[data] || rooms.has(data))
      client.emit('checkRoom', true);
    else
      client.emit('checkRoom', false);
  });
});
