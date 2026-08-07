require("dotenv").config();
const express = require("express");
const noteRoutes = require("./routes/notes");

const session = require("express-session");

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.static("public"));

app.use("/notes", noteRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});