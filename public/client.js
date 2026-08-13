document.getElementById("delete-all-notes").addEventListener("click", async () => {
    const response = await fetch("/notes/deleteAll", {
        method: "DELETE",
    });
    const result = await response.json();
    console.log(result);
    loadNotesOnScreen();
});

document.getElementById("create-notes").addEventListener("click", async () => {
    const response = await fetch("/notes/createNote", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify( { 
            title: document.getElementById("note-title").value,
            content: document.getElementById("note-content").value,
            favorite: false})
    }); 
    const result = await response.json();
    loadNotesOnScreen();
});

document.getElementById("delete-singular-button").addEventListener("click", async () => {
    const response = await fetch("/notes/deleteSingularNote", {
        method: "DELETE",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify( { removeID: document.getElementById("delete-singular").value })
    });
    const result = await response.json();
    console.log(result);
    loadNotesOnScreen();
});

let offsets = 0;
document.getElementById("next-page").addEventListener("click", async () => {
    offsets += 5;
    loadNotesOnScreen()
});

document.getElementById("previous-page").addEventListener("click", async () => {
    if (offsets <= 0) {
        offsets = 0;
    } else {
        offsets -= 5;
    }
    loadNotesOnScreen()
});


async function loadNotesOnScreen() {
    const response = await fetch(`/notes/?offsets=${encodeURIComponent(offsets)}`);
    const notes = await response.json();
    noteCreation(notes);
}
loadNotesOnScreen();


document.getElementById("search-notes").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        filterNotes();
    }
})

async function filterNotes() {
    const search = document.getElementById("search-notes").value;
    const response = await fetch(`/notes/filter?search=${encodeURIComponent(search)}`);
    const notes = await response.json();

    noteCreation(notes);
}

let setFavorite = false;
document.getElementById("filter-favorite").addEventListener("click", async () => {
    setFavorite = !setFavorite;
    document.getElementById("filter-favorite").style.backgroundColor = setFavorite ? "red": "white";
    if (!setFavorite) {
        loadNotesOnScreen();
        return;
    }
    const response = await fetch("/notes/filterFavorites");
    const notes = await response.json();

    noteCreation(notes);
});


async function noteCreation(notes) {
    const container = document.getElementById("notes");
    container.innerHTML = ``;

    for (const note of notes) {
        const newNote = document.createElement("div");
        newNote.innerHTML = `
            <p>${note.title}</p>
            <p>${note.id}</p>
            <p>${note.content}</p>
            <button>favorite</button>`

        const button = newNote.querySelector("button");

        button.style.backgroundColor = note.favorite ? "red" : "white";
        button.addEventListener("click", async () => {
            const response = await fetch("/notes/change-favorite", {
                method: "PATCH",
                headers: { "Content-type": "application/json"},
                body: JSON.stringify({id: note.id}) 
            }) 
            const updateNote = await response.json();


            if (updateNote.favorite) {
                button.style.backgroundColor = "red";
            } else {
                button.style.backgroundColor = "white";
            }
        });
        container.appendChild(newNote);
    }
}


document.getElementById("update-note").addEventListener("click", async () => {
    let title = document.getElementById("update-title").value;
    let content = document.getElementById("update-content").value;
    const id = document.getElementById("id-to-update").value

    if (title === "") {
        title = null;
    }
    if (content === "") {
        content = null;
    }
    await fetch("/notes/updateNote", {
        method: "PATCH",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({title: title, content: content, id: id})
    });
    loadNotesOnScreen();

});

document.getElementById("signup-button").addEventListener("click", async () => {
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    await fetch("/notes/signup", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({username: username, password: password})
    });
    loadNotesOnScreen();
    document.getElementById("username-text").textContent = `Username: ${username}`;
});


document.getElementById("login-button").addEventListener("click", async () => {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;
    await fetch("/notes/login", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({username: username, password: password})
    });
    loadNotesOnScreen();
    document.getElementById("username-text").textContent = `Username: ${username}`;
});
