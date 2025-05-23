//controllers/PostController.js
const posts = require('../db/storeposts.js');
const fs = require('fs');
const path = require('path');  //x path absolute of your root
const multer = require('multer');  //x upload file img on server(express)
const util = require('util');
const connection = require('../connection/connection.js');
const query = util.promisify(connection.query).bind(connection);  //!!!transform 'connection.query'(function callback-style) in funct taht returns a Promise, because basic .query() doesn't support async/await + bind (binding)

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


//INDEX 
// const index = (req,res)=>{
//     if (err) {
//         // console.error('Error fetching manga:', err);
//         return res.status(500).json({ error: err });
//     }
//     return res.status(200).json({  //the same x index db storeposts.js
//         data : posts,
//         counter : posts.length
//     });
// };

const index = (req,res)=>{    //INDEX  x db
    const query = 'SELECT * FROM manga';
    connection.query(query, (err, results) => {
        if (err) {
            // console.error('Error fetching manga:', err);
            return res.status(500).json({ error: err });
        }
        return res.status(200).json({  //the same x index db storeposts.js
            data : results,
            counter : results.length
        });
    });
};



//SHOW
// const show = (req,res)=>{    //SHOW
//     const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
//     console.log(postIndex);
//     if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
//         return res.status(404).json({
//             error : '404 Not Found'
//         });
//     }
//     return res.status(200).json({
//         data : posts[postIndex]
//     });
// };

const show = (req,res)=>{
    const mangaId = Number(req.params.id);
    const query = 'SELECT * FROM manga WHERE id=?';
    connection.query(query, [mangaId], (err,results)=>{
        if(err){
            // console.error('Error fetching manga:',err);
            return res.status(500).json({error:err})
        }
        if(results.lenght === 0){  //if(!results[0]) cioè se non esiste il primo item dell'array esiste
            return res.status(404).json({
                error : '404 Not Found',
            })
        }
        return res.status(200).json({
            data: results[0],
        });
    });
};


//STORE 
// const store = (req,res)=>{    //STORE
//     //console.log(req.body);
//     const filePath = req.file ? `/imgcover/${req.file.filename}` : null; // Percorso servibile
//     const post = {
//         //id : posts.length > 0 ? posts[posts.length-1].id+1 : 1,
//         id: req.body.id,
//         slug : req.body.slug,   //x SEO, i.e. //example.com/blog/come-fare-una-ricetta-fantastica is better than example.com/blog/3452
//         title : req.body.title,
//         content : req.body.content,
//         price : req.body.price,
//         //file : req.body.file,
//         file : filePath,
//         category: req.body.category,
//         tags : req.body.tags,
//         visibility: req.body.visibility,
//     };
//     //console.log(post);
//     posts.push(post);
//     console.log(posts);
//     try{  
//         fs.writeFileSync(dbPath,`module.exports = ${JSON.stringify(posts,null,4)}`);
//         //console.log({data:posts});  //see the output
//         return res.status(201).json({  //201 created new resources
//             data : posts,
//             counter : posts.length
//         });
//     }
//     catch{
//         return res.status(500).json({ error: 'Error storing the post data.' });
//     }
// };

// const store = (req,res) =>{
//     const {slug, title, content, price, category, tags, visibility } = req.body;
//     const filePath = req.file ? `/imgcover/${req.file.filename}` : null;

//     const mangaQuery = `
//         INSERT INTO manga (slug, title, content, price, file, category, visibility)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//     const mangaParams = [slug,title,content,price, filePath, category, visibility];
//     connection.query(query,mangaParams,(err,mangaResult)=>{
//         if(err) return res.status(500).json({error:err})
//         const mangaId = result.insertId;  //id generated by the db
//         const tagInsertQuery = `
//             INSERT IGNORE INTO tags (label)
//             VALUES ${tags.map((item,index)=> '(?)' ).join(', ')}
//         `;   //IGNORE doesn't add tag if it already exist (but the column must have UNIQUE)

//         connection.query(tagInsertQuery, tags, (tagErr)=>{
//             if(tagErr) return res.status(500).json({error: tagErr});
//             const tagIdQuery = `
//                 SELECT id FROM tags WHERE label IN (${tags.map((item,index)=> '?').join(', ') })
//             `;
//             connection.query(tagIdQuery, tags, (tagIdErr, tagResults)=>{
//                 if(tagIdErr) return res.status(500).json({error:tagIdErr});
//                 const mangaTagData = tagResults.map(item=>[mangaId,item.id]);  //
//                 const mangaTagQuery = `
//                     INSERT INTO manga_tags (manga_id,tag_id)
//                     VALUES (?,?)
//                 `;
//                 connection.query(mangaTagQuery, [mangaTagData], (mangaTagErr)=>{
//                     if(mangaTagErr) return res.status(500).json({error:mangaTagErr});
//                     res.status(201).json({
//                         message: 'manga created successfully!!',
//                         data: {
//                             id: mangaId,
//                             slug,
//                             title,
//                             content,
//                             price,
//                             file: filePath,
//                             category,
//                             tags,
//                             visibility
//                         }
//                     })
//                 })
//             })  
//         })
//     })
// }

const store = async (req, res) => {
  const { slug, title, content, price, category, tags, visibility } = req.body;
  const filePath = req.file ? `/imgcover/${req.file.filename}` : ''; //column file cannot be null!!

  const mangaInsertQuery = `
    INSERT INTO manga (slug, title, content, price, file, category, visibility)
    VALUES (?, ?, ?, ?, ?, ?, ?)  
  `;  //? prevents SQL injection

  try {
    //insert manga
    const mangaResult = await query(mangaInsertQuery, [
      slug, title, content, price, filePath, category, visibility
    ]);
    const mangaId = mangaResult.insertId;

    //insert new tags (if exixt)
    const insertTags = `
      INSERT IGNORE INTO tags (label)
      VALUES ${tags.map(() => '(?)').join(', ')}  
    `;  //"INSERT IGNORE INTO tags (label) VALUES (?), (?), (?)"
    await query(insertTags, tags);  //await all tags are stored before continue the code

    //get tag IDs
    const selectTagIds = `
      SELECT id FROM tags WHERE label IN (${tags.map(() => '?').join(', ')})
    `;
    const tagResults = await query(selectTagIds, tags);

    //create relationships in the bridge tab
    const mangaTags = tagResults.map(tag => [mangaId, tag.id]);
    const insertMangaTags = `
      INSERT INTO manga_tags (manga_id, tag_id) VALUES ?
    `;
    await query(insertMangaTags, [mangaTags]);

    return res.status(201).json({
      message: 'Manga created successfully!',
      data: {
        id: mangaId,
        slug,
        title,
        content,
        price,
        file: filePath,
        category,
        tags,
        visibility
      }
    });

  } catch (err) {
    console.error("Error in storing manga:", err);
    return res.status(500).json({ error: err.message });
  }
};



//UPDATE
// const update = (req,res)=>{    //UPDATE
//     //console.log('go update');
//     const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));
//       //se non trova return -1
//     console.log(postIndex);
//     if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
//         return res.status(404).json({
//             error : '404 Not Found'
//         });
//     }
//     const newpost = {
//         ...posts[postIndex], // create copy of actual posts[postIndex]
//         title: req.body.title || posts[postIndex].title,  //overwrite only if found posts[postIndex].title
//         slug: req.body.slug || posts[postIndex].slug,
//         content: req.body.content || posts[postIndex].content,
//         image: req.body.image || posts[postIndex].image,
//         tags: req.body.tags || posts[postIndex].tags
//     }
//     posts[postIndex] = newpost;
//     try{
//         fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
//         return res.status(200).json({
//             data : newpost,
//         });
//     }
//     catch{
//         return res.status(500).json({ error: 'Error updating the post data.' });
//     }
// };

const update = async (req,res) =>{
    const mangaId = Number(req.params.id);
    const { title,slug,content,price,file, category, tags, visibility,} = req.body;
    const filePath = req.file ? `/imgcover/${req.file.filename}` : null;

    const queryUpdate = `
        UPDATE manga 
        SET 
            slug = COALESCE(?, slug), 
            title = COALESCE(?, title), 
            content = COALESCE(?, content), 
            price = COALESCE(?, price), 
            file = COALESCE(?, file), 
            category = COALESCE(?, category), 
            visibility = COALESCE(?, visibility) 
        WHERE id = ?    
    `;  //COALESCE retains the current value if the new value is null/undefined

    const params = [
      slug,
      title,
      content,
      price,
      filePath,
      category,
      visibility,
      mangaId,
    ];

    try {
      const result = await query(queryUpdate, params);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "404 Not Found" });
      }

      return res.status(200).json({
        message: `Manga id ${mangaId} updated successfully.`,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    // connection.query(query,params,(err,result)=>{
    //     if(err){
    //         return res.status(500).json({error:err})
    //     }
    //     if (result.affectedRows === 0){
    //         return res.status(404).json({
    //             error : '404 Not Found',
    //         })
    //     }
    //     return res.status(200).json({
    //         message : `Manga id ${mangaId} updated successfully.`
    //     })
    // })
}


//DESTROY 
// const destroy = (req,res)=>{    //DESTROY
//     const postIndex = posts.findIndex((intem,index)=> intem.id === Number(req.params.id));  //findIndex always return -1 if doesn't find the item
//     if(postIndex===-1){  //!post sarebbe ambiguo con posts[0] e un post mancante (-1)
//         return res.status(404).json({
//             error : '404 Not Found'
//         });
//     }
//     posts.splice(postIndex, 1);  //!non riassegnare gli id ma nella lista lasciare buchi perche gli id sono unici!, ma puoi crearne incrementali
//     try{
//         fs.writeFileSync('../db/storeposts.js',`module.exports=${JSON.stringify(posts,null,4)}`);
//         return res.status(200).json({
//             data : posts,
//             counter : posts.length
//         });
//     }
//     catch{
//         return res.status(500).json({ error: 'Error deleting the post data.' });
//     }
// };

// const destroy = (req, res) => {
//     const mangaId = Number(req.params.id);
//     if (!mangaId || mangaId <= 0) {
//         return res.status(400).json({ error: 'Invalid manga ID' });
//     }
//     const queryStr = 'DELETE FROM manga WHERE id = ?';

//     connection.query(queryStr, [mangaId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: '404 Not Found' });
//         }
//         return res.status(200).json({
//             message: `Manga id ${mangaId} deleted successfully.`
//         });
//     });
// };

const destroy = async (req, res) => {
    const mangaId = Number(req.params.id);

    if (!mangaId || mangaId <= 0) {
        return res.status(400).json({ error: 'Invalid manga ID' });
    }

    const queryDelete = 'DELETE FROM manga WHERE id = ?';

    try {
        const result = await query(queryDelete, [mangaId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '404 Not Found' });
        }

        return res.status(200).json({
            message: `Manga id ${mangaId} deleted successfully.`
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
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