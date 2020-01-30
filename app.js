const app=require('express')();

//import momentjs
const moment=require('moment');

// import fs
const fs=require('fs');
const ws=fs.createWriteStream('./file.txt', {flags : "a"});

const http=require('http');
const server=http.createServer(app);

const socket=require('socket.io');
const io=socket(server);

//import public file
const path=require('path');
// const publicDirectoryPath=path.join(__dirname, '/public');
// app.use(express.static(publicDirectoryPath));

app.get('/', (request, response)=>{
    response.sendFile(__dirname + '/public/index.html');
});

var storeUserName=[];
io.on('connection', (socket)=>{
    console.log('socket connected!');
    //new user
    socket.on('new user', (newName, callBack)=>{
        if(storeUserName.indexOf(newName) != -1) //if true return -1, name exist
            return callBack(false);

        callBack(true);
        // create current user 
        socket.currentUsername=newName; //create socket variable
        console.log(socket.currentUsername);
        storeUserName.push(socket.currentUsername);
        // storeUserName.push(newName);
        updateUsername(newName);
    });

    var updateUsername=(data)=>{
        //send user names
        io.emit('userNames', storeUserName);   
    }
    const currentDate=moment().format('llll'); //Thu, Jan 30, 2020 1:08 AM 
    console.log(currentDate);

    socket.on('send message', (data)=>{
        console.log(data, '38 line');
        ws.write(`${socket.currentUsername +': ' +data +' '+currentDate } \n`);
        io.emit('new message', {msg:data, date: currentDate, user:socket.currentUsername});
    });

    socket.on('disconnect', (data)=>{
        if(!socket.currentUsername)
            return;
        //remove currentUsername
        storeUserName.splice(storeUserName.indexOf(socket.currentUsername), 1);
        updateUsername();
    })
});

server.listen(3000, ()=>{
    console.log('Server running on port 3000!');
});

// const userData=['Manju', 'Sandhya', 'Nayna', 'Senorita', 'Angel', 'Devil'];
// console.log(userData.splice(userData.indexOf('Senoritaa'), 1));

// const data='Manju'

// if(userName.indexOf(data) != -1) //if true return -1
//     return console.log('-1 name exist!'); //name exist
// console.log('New user!');

