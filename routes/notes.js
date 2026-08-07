const express = require("express");
const router = express.Router();

function auth(req, res, next) {
    if (!req.session.user_id) {
        return res.json({ message: "Not logged in"});
    }
    next();
}


const {
    getNotes,
    createNotes,
    deleteAllNotes,
    deleteSingularNote,
    searchForNotes,
    clickFavorite,
    filterFavorite,
    updateNote,
    logIn,
    signUp,
} = require("../controllers/notesController.js");


router.get("/", auth, getNotes);

router.post("/createNote", auth, createNotes);

router.delete("/deleteAll", auth, deleteAllNotes);

router.delete("/deleteSingularNote", auth, deleteSingularNote);

router.get("/filter", auth, searchForNotes);

router.patch("/change-favorite", auth, clickFavorite);

router.get("/filterFavorites", auth, filterFavorite);

router.patch("/updateNote", auth, updateNote);

router.post("/login", logIn);

router.post("/signup", signUp);

module.exports = router;