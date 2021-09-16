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
        res.status(400).json({ message: 'No user found with this ID! '});
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
  // update user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true })
      .then(dbUserData => {
        if(!dbUserData){
          res.status(404).json({ message: 'No user found with this ID!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  
   //delete user
   deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "No user found with ths id! "});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.UserId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      User.findOneAndUpdate(
          { _id: params.userId },
          { $addToSet: { friends: params.friendId } },
          { new: true, runValidators: true }
      )
      .then(secondDbUserData => {
          if (!secondDbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
  },
    removeFriend({ params }, res) {
      User.findOneAndUpdate(
        {_id: params.userId },
        { $pull: {friends: params.friendId }}, 
        { new: true, runValidators: true }    
      )
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No user found with this id! '});
          return;
        }
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: {friends: params.friendId }},
          { new: true, runValidators: true }
        )
        .then(secondDbUserData => {
          if(!secondDbUserData){
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
    }

};


module.exports = userController;