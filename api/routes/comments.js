const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const CommentsController = require('../controllers/commentsController');

router.get('/', checkAuth, CommentsController.comments_get_all);
router.post('/', checkAuth, CommentsController.comments_post);
router.get('/:commentId', checkAuth, CommentsController.comments_get_single);
router.patch('/:commentId', checkAuth, CommentsController.comments_patch);
router.delete('/:commentId', checkAuth, CommentsController.comments_delete);

module.exports = router;