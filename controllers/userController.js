const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const allUsers = await User.find()
        .sort({ _id: -1 })
        .populate("thoughts")
        .populate("friends");
      return res.status(200).json(allUsers);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a users
  async getSingleUser(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.id })
        .populate("thoughts")
        .populate("friends");
      if (!userData)
        return res.status(400).json({ message: "No user with that id." });
      return res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Create a user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a course
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: req.params.id
      });
      // Delete thoughts
      await Thought.deleteMany({
        _id: { $in: deletedUser.thoughts }
      });
      return res.status(200).json(deletedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updatedUser)
        return res.status(400).json({ message: "No user with that id." });
      return res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Add to friendList

  async addToFriendList(req, res) {
    try {
      const friendUser = await User.findOne({ _id: req.params.friendId });
      if (!friendUser)
        return res.status(400).json({ message: "No user with that id." });

      await User.updateOne(
        { _id: req.params.userId, friends: { $ne: req.params.friendId } },
        { $push: { friends: req.params.friendId } }
      );

      return res.status(200).json({ message: "Added to friend list." });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Delete from friendList

  async deleteFromFriendList(req, res) {
    try {
      await User.updateOne(
        { _id: req.params.userId, friends: req.params.friendId },
        { $pull: { friends: req.params.friendId } }
      );

      return res.status(200).json({ message: "Removed from the friend list." });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};
