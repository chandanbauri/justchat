var express = require('express');
var socket = require('socket.io');
//var io2 = require('socket.io-client');

var users = {};

// App setup
var app = express();

var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

    
// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);

io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
       io.sockets.emit('chat', data);
       var name = data.handle;
       users[socket.id] = data.handle;
        
                socket.broadcast.emit('only', {
            name: name,
            online:'online'
       });
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('test',()=>{
        console.log('i am on');
    })
 
    
     /*io.sockets.emit('hello',{ count: io.sockets.clients()}
         );
     */
         io.clients((error, clients) => {
            if (error) throw error;
            console.log(clients.length); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
            
            socket.on('hello', function(){ 
                const count = clients.length;
            io.sockets.emit('hello',  count
          );
            });
          });

          socket.on('disconnect', function () {
            socket.broadcast.emit('only1', {
                name: users[socket.id],
                online:'offline'
            });
        });
          
});

