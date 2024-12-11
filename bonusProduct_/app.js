const HOST = process.env.HOST;
const PORT = process.env.PORT;

const express = require('express');
const app = express();

const ProductsRouter = require('./routers/products.js');
app.use(express.json());

app.listen(PORT,(req,res)=>{
    console.log(`Server is running at ${HOST}:${PORT}`);
});
app.get('/',(req,res)=>{
    res.send('Product Main Page');
});
app.get('/:slug',ProductsRouter);
