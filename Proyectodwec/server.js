let express = require('express');
let app = express();//referencia a lo de arriba
var path = require('path');
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

//we will store the player data in memory on the server
var  players = {};
var numplayers = 0;

var bananas = {
  x1: Math.floor(Math.random() * 460) + 185,
  x2: Math.floor(Math.random() * 460) + 185,
  x3: Math.floor(Math.random() * 460) + 185,
  
  
  y: 12
};



app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});




//SERVER: Listener for every new CLIENT connections
io.on('connection', function (socket) {
  numplayers++;
  console.log('a user connected:' + socket.id);

  //creata a new PLAYER OBJECT with the KEY (socket.id)
  players[socket.id] = {  
    x:  50 * numplayers,
    y: 500,
    playerId: socket.id,
    active: false, 
    player: 0,
    texture: ""
  };
  //Send to everybody including me
  socket.emit('currentPlayersMenu', players);


  
  

  socket.broadcast.emit('newPlayer', players[socket.id]);

  //LISTENERS FOR Each CLIENT 
  socket.on('playerStartLevel1',function(data){
    players[socket.id].active = true;  //change active
    players[socket.id].texture = data;  
    io.emit('currentPlayers', players);
  });
   
  socket.on('StartLevel1',function(){ 
    
    io.emit('currentPlayersPlaying', players);
  });

  //to know if it is player 1 or 2
  socket.on('setPlayer',function(data){
      players[socket.id].player=data.player;
      players[socket.id].active = true;  //change active
      players[socket.id].texture = data.texture;
      players[socket.id].x = (data.player == 1 ) ? 300 : 550; 
      //players[socket.id].x = 150 * data.player;
      players[socket.id].y = 500;
      io.emit('currentPlayersWaiting', players);
      io.emit('currentPlayersMenu', players);
    
   console.log("player assigned:");
   console.log(players[socket.id]);
      
  });
  


  socket.on('quitFromLevel1',function(data){
    players[socket.id].active = false;  //change active
    players[socket.id].texture = "";  
    io.emit('currentPlayers', players);
    io.emit('disconnectFromGame', socket.id);
  });

  //DISCONNECT
  socket.on('disconnect', function () {
    console.log('user disconnected:' + socket.id);
    numplayers--;
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });


socket.on('playerMovement', function (movementData) {
  players[socket.id].x = movementData.x;
  players[socket.id].y = movementData.y;
  socket.broadcast.emit('playerMoved', players[socket.id]);
});


socket.on('BananaLocation', function () {
  bananas.x1 = Math.floor(Math.random() * 460) + 185;
  bananas.x2 = Math.floor(Math.random() * 460) + 185;
  bananas.x3 = Math.floor(Math.random() * 460) + 185;
  io.emit('BananaAppear', bananas);
});

socket.on('end', function (data) {
  io.emit('endLevel1', data);
});

/*socket.on('resetBanana', function (data) {
  
  io.emit('BananaAppear',{x1: data.x1 , x2: data.x2 , x3: data.x3 });
});*/


});

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
