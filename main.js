const app = {
	data: {
		credentials: {
			username: 'charlie'/*sessionStorage.getItem('username')*/,
			password: 'mypass'/*sessionStorage.getItem('password')*/
		},
		notes: []
	},
	setAuthHeader: function (headers) {
		if (!headers) {
			header = {}
		}
		console.log(this.data.credentials.username, this.data.credentials.password)

		return 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
	},

	setCredentials: function (username, password) {
		this.data.credentials = {
			username: username,
			password: password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	login: function (username, password) {
		fetch('https://notes-api.glitch.me/api/notes', {
			headers: {
				'Authorization': this.setAuthHeader()
			}
		}).then(response => {
			if (response.ok) {
				this.setCredentials(username, password);
				document.querySelector('#login').classList.remove('input-invalid');

				document.querySelector('#login').classList.add('hidden')
				document.querySelector('#createNote').classList.remove('hidden')
	
			} else {
				document.querySelector('#login').classList.add('input-invalid');
				document.querySelector('#error').innerText = 'That is not a valid username and password.';
			}
		})
	},

	getAllNotes: function () {
		// Access the array and place all notes in our note div
		fetch("https://notes-api.glitch.me/api/notes", {
			headers: {
				'Authorization': this.setAuthHeader(),
				'Content-Type': 'application/json'
			}
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (data) {
				app.data.notes = data
				app.render()
			})
	},

	render: function () {

		let templateLiteral = ``
		console.log({ app })
		// Grab the notes and then loop through them 
		for (let note of this.data.notes.notes) {
			tags = ``
			for (let tag of note.tags) {
				tags += `
				<button class="tag">${tag}</button>\n
				`
			}
			templateLiteral += `
				<div class="note">
					<h4 class="title">${note.title}</h4>
					<p class="text">${note.text}</p>
					<ul class="tag-list">
						${tags}
					</ul>
					<button type="button" class="update">Update</button>
					<button type="button" class="trash">Delete</button
				</div>
			`
			document.querySelector('#notes').innerHTML = templateLiteral
		}

		let tagNodes = document.querySelectorAll(".tag")
		console.log({ tagNodes })
		for (let tag of tagNodes) {
			tag.addEventListener('click', event => {
				console.log({ tag })
				this.getTaggedNotes(tag.innerText)
			})
		}
		// Adding and also checking if the createNote area is made

	},

	createNote: function (title, text, tags) {
		let tagsSplit = tags.split(',').map(tag => tag)
		console.log({tagsSplit})
		fetch("https://notes-api.glitch.me/api/notes", {
			method: 'POST',
			body: JSON.stringify({"title": title, "text": text, "tags": tagsSplit}),
			headers: {
				'Authorization': this.setAuthHeader(),
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (response.ok) {
					app.getAllNotes()
					app.replaceCreateNote()
				} 
			})
	},

	replaceCreateNote: function() {
		let newCreateNote = document.querySelector('#createNote')
		newCreateNote.innerHTML = `<div id='create-note'>
            <div class='input-field'>
                <label for='title'>Title:</label>
                <input id='titleText' type='text' name="title" placeholder="Put title here">
            </div>
            <div class='input-field'>
                <label for='text'>Text:</label>
                <textarea id='textyText' type='text' name="text-area" placeholder="Put description here"></textarea>
            </div>
            <div class='input-field'>
                <label for='tag'>Tag:</label>
                <input id="tags" type="text" name="tag" placeholder="Separate with comma and space">
            </div>
            <button id="submitNote" type='submit' value='submit'>Submit Note</button>
        </div>`
	},

	updateNote: function () {
		// Needs to be able to take the given note and update title, text, and tags
		// Using PUT with https://notes-api.glitch.me/api/notes/:id


	},

	deleteNote: function (note) {
		// Needs to be able to DELETE a given note from the users notes array
		// Then also DELETE the note from the API as well.
		// Using DELETE with https://notes-api.glitch.me/api/notes/:id

	},

	getTaggedNotes: function (tag) {
		console.log({ tag })
		fetch(`https://notes-api.glitch.me/api/notes/tagged/${tag}`, {
			headers: {
				'Authorization': this.setAuthHeader()
			}
		})
			.then(response => response.json())
			.then(data => {
				app.data.notes = data
				this.render()
			})
	}
};

function main() {
	
	const login = document.querySelector('#login');
	document.querySelector('#login').addEventListener('submit', (event) => {
		event.preventDefault();
		const loginData = new FormData(login);

		const username = loginData.get('username');
		const password = loginData.get('password');
		console.log({ loginData }, { username }, { password });
		app.login(username, password);
		app.getAllNotes();
	
	});

	let tags = document.querySelectorAll('.tag')
	console.log({tags})
	
	let submitNote = document.querySelector('#submitNote')
	submitNote.addEventListener('click', event => {
		event.preventDefault()
		let title = document.querySelector('#titleText').value
		let textyText = document.querySelector('#textyText').value
		let tags = document.querySelector('#tags').value
		console.log({tags}, {textyText}, {title})
		app.createNote(title, textyText, tags)
	})

	
}

main();