const products = require('../db/storeproducts.js');

const fs = require('fs');

const index = (req,res) =>{
    res.status(200).json({
        data : products,
        counter : products.length
    });
};
const show = (req,res)=>{
    const productIndex = products.findIndex((item,index)=> item.id === Number(req.params.id) );
    if(productIndex===-1){
        return res.state(404).json({
            error : 'product id not found'
        });
    }
    return res.status(200).json({
        data: products[productIndex]
    });
};

