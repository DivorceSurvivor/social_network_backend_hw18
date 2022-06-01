const { Thought, User } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const allThoughts = await Thought.find().sort({ _id: -1 });
      return res.status(200).json(allThoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.id });
      if (!thoughtData)
        return res.status(400).json({ message: "No thought with that id." });
      return res.status(200).json(thoughtData);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: newThought._id } }
      );
      return res.status(200).json(newThought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a course
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.id
      });
      if (!deletedThought)
        return res.status(400).json({ message: "No thought with that id." });
      await User.updateMany(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } }
      );
      return res.status(200).json(deletedThought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thoughtData)
        return res.status(400).json({ message: "No thought with that id." });
      return res.status(200).json(thoughtData);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Add a reaction
  async addReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thoughtData)
        return res.status(400).json({ message: "No thought with that id." });
      return res.status(200).json({ message: "Reaction added!" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Delete a reaction
  async removeReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        {
          $pull: {
            reactions: { reactionId: req.params.reactionId }
          }
        },
        { runValidators: true, new: true }
      );
      if (!thoughtData)
        return res.status(400).json({ message: "No thought with that id." });
      return res.status(200).json({ message: "Reaction removed!" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
};
