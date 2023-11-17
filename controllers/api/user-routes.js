const router = require('express').Router();
const { Username, Post } = require('../../models');

// CREATE new user
router.post('/new_user', async (req, res) => {
  try {
    const dbUserData = await Username.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = dbUserData.id;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await Username.findOne({ where: { username } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect username or password' });
      return;
    }
    const validPassword = userData.checkPassword(password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect username or password' });
      return;
    }

    req.session.save(() => {
          req.session.loggedIn = true;
          req.session.userId = userData.id; 

          res.status(200).json({ username: userData, message: 'You are now logged in' });
        });
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
      req.session.userId = null;
      res.json({ message: 'Logout successful' });
      res.redirect('/');
  } else {
    res.status(404).end();
  }
});

// router.get posts
// router.post post
// router.delete post

module.exports = router;