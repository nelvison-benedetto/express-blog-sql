//router/posts.js
const express = require('express');
const router =  express.Router();

const PostController = require('../controllers/PostController.js');

const { upload } = PostController; // Import Multer configurated

router.get('/',PostController.index);
router.get('/:id',PostController.show);
//router.post('/', PostController.store);
router.post('/', upload.single('file'), PostController.store);   //x upload also file with Multer
router.put('/:id',PostController.update);
router.delete('/:id',PostController.destroy);

module.exports = router;


