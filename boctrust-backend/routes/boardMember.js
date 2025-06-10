const express = require("express");
const router = express.Router();
const BoardMember = require("../models/BoardOfDirectors");

// Fetch all board members
router.get("/fetch-all", async (req, res) => {
  try {
    const boardMembers = await BoardMember.find();
    res.status(200).json(boardMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching board members", error });
  }
});

// Add a new board member
router.post("/add-member", async (req, res) => {
  try {
    const { name, title, biography } = req.body;
    const newBoardMember = new BoardMember({ name, title, biography });
    await newBoardMember.save();
    res.status(201).json(newBoardMember);
  } catch (error) {
    res.status(500).json({ message: "Error adding board member", error });
  }
});

// Edit a board member
router.put("/edit-member/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const boardMember = await BoardMember.findByIdAndUpdate(id, updatedData, { new: true });

    if (!boardMember) {
      return res.status(404).json({ message: "Board member not found" });
    }

    res.json(boardMember);
  } catch (error) {
    res.status(500).json({ message: "Error updating board member", error });
  }
});

// Delete a board member
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const boardMember = await BoardMember.findByIdAndDelete(id);

    if (!boardMember) {
      return res.status(404).json({ message: "Board member not found" });
    }

    res.json({ message: "Board member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting board member", error });
  }
});

module.exports = router;


