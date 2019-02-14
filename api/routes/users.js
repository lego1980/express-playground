const express = require('express');
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

//image upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }    
}
const upload = multer({
    storage: storage, 
    limits:  1024 * 1024 * 5,
    fileFilter: fileFilter
});

//controller
const UsersController = require('../controllers/usersController');

//routes
router.get('/', UsersController.users_get_all);
//similar to signup but without email validation
router.post('/', upload.single('userimage'), checkAuth, UsersController.users_post);
router.get('/:userId', checkAuth, UsersController.users_get_single);
router.patch('/:userId', checkAuth, UsersController.users_patch);
router.delete('/:userId', checkAuth, UsersController.users_delete);
//login
router.post('/login', UsersController.users_login);
//sign up with hash and validation for existing email
router.post('/signup', upload.single('userimage'), UsersController.users_signup);

module.exports = router;