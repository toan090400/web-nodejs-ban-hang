var express = require('express');
var router = express.Router();

// Get Page module
var Product = require('../models/product');
var User = require('../models/user');

// Get search
router.get('/', function (req, res) {
    res.render('search', {
        title:'Search',
    });

});

//Post search
router.post('/getProducts', async (req,res)=> {
    let payload = req.body.payload.trim();
    
    let search = await Product.find({
        "$or":[
            // {title: {$regex: new RegExp('^'+payload+'.*','i')}},
            {title: {$regex: new RegExp(`^.*${payload}`,'i')}},
            
        ]
    }).exec();

    search = search.slice(0,10);
    res.send({payload: search});

});

router.get("/search_api/:key",async (req,res)=>{
    let products = await Product.find(
        {
            "$or":[
                {title:{$regex:req.query.search}},
            ]
        }
    )
    
    res.render('search_api', {
        products: products,
        title: 'Kết quả',
    })
    
})











// Exports
module.exports = router;