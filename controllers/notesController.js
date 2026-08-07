const pool = require("../data/db");

async function getNotes(req, res) {
    const result = await pool.query(`SELECT * FROM notes  WHERE user_id = $2 ORDER BY id LIMIT 5 OFFSET $1`, [req.query.offsets, req.session.user_id]);
    res.status(200).json(result.rows);
}

async function createNotes(req, res) {
    const result = await pool.query(`INSERT INTO notes (title, content, favorite, user_id) VALUES  ($1, $2, $3, $4) RETURNING *`,
        [req.body.title, req.body.content, req.body.favorite ?? false, req.session.user_id]);
    res.status(201).json(result.rows[0]);
}

async function deleteAllNotes(req, res) {
    await pool.query(`DELETE FROM notes WHERE user_id = $1`, [req.session.user_id]);
    res.json({ message: "deleted all notes"});
}

async function deleteSingularNote(req, res) {
    await pool.query(`DELETE FROM notes WHERE id = $1 AND user_id = $2`, [req.body.removeID, req.session.user_id])
    res.json({ message: "note deleted"});
}

async function searchForNotes(req, res) {
    const result = await pool.query(`SELECT * FROM notes WHERE title LIKE $1 AND user_id = $2`, [`%${req.query.search}%`, req.session.user_id]);
    res.status(200).json(result.rows);

}

async function clickFavorite(req, res) {
    const result = await pool.query(`UPDATE notes SET favorite = NOT favorite WHERE id = $1 AND user_id = $2 RETURNING *`, [req.body.id, req.session.user_id]);
    res.json(result.rows[0]);
}

async function filterFavorite(req, res) {
    const result = await pool.query(`SELECT * FROM notes WHERE favorite IS TRUE AND user_id = $1`, [req.session.user_id]);
    res.status(200).json(result.rows);
}


async function updateNote(req, res) {
    const result = await pool.query(`UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content) WHERE id = $3 AND user_id = $4 RETURNING *`,
        [req.body.title, req.body.content, req.body.id, req.session.user_id]);
    res.json(result.rows[0]);
}

const bcrypt = require("bcrypt");

async function signUp(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`,
         [req.body.username, hashedPassword]);
    res.status(201).json({ message: "Account created"});
}

async function logIn(req, res) {
    const result = await pool.query(`SELECT id, username, password FROM users WHERE username = $1`, [req.body.username]);
    const user = result.rows[0];

    if (!user) {
        return res.json({ message: "invalid login"});
    }
    const passwordCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCheck) {
        return res.json({ message: "invalid login"});
    }
    req.session.user_id = user.id;
    res.json({ message: "signed in" });
}



module.exports = {
    getNotes,
    createNotes,
    deleteAllNotes,
    deleteSingularNote,
    searchForNotes,
    clickFavorite,
    filterFavorite,
    updateNote,
    logIn,
    signUp
};