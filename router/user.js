const express = require("express");
const router = express.Router();
const {
  feedPageController,
  profilePageController,
  userProfilePageController,
  editPageController,
  uploadPageController,
  searchPageController,
  uploadController,
  updateController,
  postController
} = require("../controllers/usersController");
const { userIsLoggedIn } = require("../middleware/loggedIn");
const upload = require('../config/multer');

router.use(userIsLoggedIn);

router.get("/feed", feedPageController);
router.get("/profile", profilePageController);
router.get("/userprofile", userProfilePageController);
router.get("/edit", editPageController);
router.get("/upload", uploadPageController);
router.get("/search", searchPageController);



router.post('/upload', upload.single('image'),uploadController);
router.post('/update', updateController);
router.post('/post', upload.single('image'), postController);

module.exports = router;
