//app.js

const express = require('express');
const app = express();
require('dotenv').config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const cors = require('cors');  //per far accedere alle tue rotte da altri domini(i.e un altro localhost)! (used npm install cors)
const path = require('path');

const PostsRouter = require('./routers/posts.js');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware.js');
const dbConnection = require('./connection/connection.js');  //X DB MYSQL

app.use(express.json());
app.use(cors());

app.use('/imgcover', express.static(path.join(__dirname, 'public/imgcover')));  //X UPLOAD FILE ON SERVER



app.listen(PORT, (req,res)=>{
    console.log(`Server is running at ${HOST}:${PORT}`);
});

// Middleware to serve static files from the "public" directory, when client ask x file react look into "public" folder
app.use(express.static('public'));  //no need "/imgcover" to serve files in "public" folder

app.get('/',(req,res)=>{   //test http://localhost:3001/something/
    res.send('Main Page')
});
app.use('/:slug',PostsRouter);  //test http://localhost:3001/something/...

// https://github.com/fabiopacifici/node_132/tree/main/live-pizza-express#lets-create-a-custom-error-handler-middleware
// middleware to trigger a 500 error
app.use('/posts', (req, res, next) => {
    throw new Error("You broke everything dude!");
  }); 
// Not found middleware
app.use(notFoundMiddleware);


// app.use((err,req,res,next)=>{
//     console.log("Error",err.message);
//     console.error(err.stack);
//     res.status(500).send({
//         message : "Something went wrong",
//         error : err.message
//     });
// });