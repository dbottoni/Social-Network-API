const { User, Thought } = require('../models');

const userController = {
  // get All users
  getAllUsers(req, res) {
    User.find({})
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.sendStatus(400).json(err);
    });
  },

  // get one user by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id})
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      if(!dbUserData){
        res.status(400).json({ message: 'No user found with this ID '});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
  },

  // create post new User
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },
  updateUser()



};


module.exports = userController;