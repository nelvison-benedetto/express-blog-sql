//controllers/PostController.js
const posts = require('../db/storeposts.js');
const fs = require('fs');
const path = require('path');  //x path absolute of your root
const multer = require('multer');  //x upload file img on server(express)
const connection = require('../connection/connection.js');

// Ottieni il percorso assoluto per il file storeposts.js
const dbPath = path.join(__dirname, '../db/storeposts.js');  //with only '../db/storeposts.js' in Store return me error 500!

const pathImagecover = path.join(__dirname, '../public/imgcover');
// Set Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, pathImagecover);  // Salva i file nella cartella 'public/images'
    },
    filename: (req, file, cb) => {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  //BETTER USE THIS X SECURITY & NAME CONFLICTS!!
      //cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Usa un nome unico generato
      cb(null, file.originalname);  //mantiene il nome del file uploaded
    },
});
const upload = multer({ storage: storage });


const index = (req,res)=>{    //INDEX  x db
    const query = 'SELECT * FROM manga';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching manga:', err);
            return res.status(500).json({ error: 'Error fetching manga from database.' });
        }
        return res.status(200).json({
            data : posts,
            counter : posts.length
        });
    });
};

const show = (req,res)=>{    //SHOW
    const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
    console.log(postIndex);
    if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    return res.status(200).json({
        data : posts[postIndex]
    });
};

const store = (req,res)=>{    //STORE
    //console.log(req.body);
    const filePath = req.file ? `/imgcover/${req.file.filename}` : null; // Percorso servibile
    const post = {
        //id : posts.length > 0 ? posts[posts.length-1].id+1 : 1,
        id: req.body.id,
        slug : req.body.slug,   //x SEO, i.e. //example.com/blog/come-fare-una-ricetta-fantastica is better than example.com/blog/3452
        title : req.body.title,
        content : req.body.content,
        price : req.body.price,
        //file : req.body.file,
        file : filePath,
        category: req.body.category,
        tags : req.body.tags,
        visibility: req.body.visibility,

    };
    //console.log(post);
    posts.push(post);
    console.log(posts);
    try{  
        fs.writeFileSync(dbPath,`module.exports = ${JSON.stringify(posts,null,4)}`);
        //console.log({data:posts});  //see the output
        return res.status(201).json({  //201 created new resources
            data : posts,
            counter : posts.length
        });
    }
    catch{
        return res.status(500).json({ error: 'Error storing the post data.' });
    }
};

const update = (req,res)=>{    //UPDATE
    //console.log('go update');
    const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
      //se non trova return -1
    console.log(postIndex);
    if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    const newpost = {
        ...posts[postIndex], // create copy of actual posts[postIndex]
        title: req.body.title || posts[postIndex].title,  //overwrite only if found posts[postIndex].title
        slug: req.body.slug || posts[postIndex].slug,
        content: req.body.content || posts[postIndex].content,
        image: req.body.image || posts[postIndex].image,
        tags: req.body.tags || posts[postIndex].tags
    }
    posts[postIndex] = newpost;
    try{
        fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
        return res.status(200).json({
            data : newpost,
        });
    }
    catch{
        return res.status(500).json({ error: 'Error updating the post data.' });
    }
};

const destroy = (req,res)=>{    //DESTROY
    const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
    if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
        return res.status(404).json({
            error : '404 Not Found'
        });
    }
    posts.splice(postIndex, 1);  //!non riassegnare gli id ma nella lista lasciare buchi perche gli id sono unici!, ma puoi crearne incrementali
    try{
        fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
        return res.status(200).json({
            data : posts,
            counter : posts.length
        });
    }
    catch{
        return res.status(500).json({ error: 'Error deleting the post data.' });
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
    upload,
}


