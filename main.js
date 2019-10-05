const app = {
	data: {
		credentials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		nuggets: []
	},
	setAuthHeader: function (headers) {
		// This will auto populate the header for when we need authorization
		// Ease-ability is nice
		if (!headers) {
			header = {}
		}

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
			// Naturally does GET but just clarifying
			headers: {
				'Authorization': this.setAuthHeader,
			},
		})
			.then(response => {
				if (response.ok) {
					this.setCredentials(username, password);
					hideLoginForm()
					this.render()
				} else {
					showLoginForm()
					document.querySelector('#login').classList.add('input-invalid');
					document.querySelector('#error').innerText = 'That is not a valid username and password.';
				}
			})
	},

	getAllNotes: function () {
		fetch("https://notes-api.glitch.me/api/notes", {
			headers: {
				Authorization: this.setAuthHeader(),
			}
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (data) {
				console.log({ data })
				console.log(this)
				// console.log(app)
				// app.data.nuggets.push('')
				// app.data.nuggets.push(data.notes)
				app.render()
			})
	},

	render: function () {
		// Adding and also checking if the createNote area is made
		let createNote = document.querySelector('.create-note')
		if (!createNote) {
			document.querySelector('#createNote').innerHTML = `
			<div class='create-note'>
				<div class='input-field'>
					<label for='title'>Title:</label>
					<input id='title-text' type='text' name="title" placeholder="Put title here">
				</div>
				<div class='input-field'>
					<label for='text'>Text:</label>
					<textarea id='textyText' type='text' name="text-area" placeholder="Put description here"></textarea>
				</div>
				<div class='input-field'>
					<label for='tag'>Tag:</label>
					<input id="tags" type="text" name="tag" placeholder="Separate with comma">
				</div>
				<button id="submitNote" type='submit' value='submit'>Submit Note</button>
			</div>`
		}
		let templateLiteral = ``
		console.log({ app })
		for (let note of app.data.nuggets.notes) {
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

		let submitNote = document.querySelector('#submitNote')
		submitNote.addEventListener('click', () => this.createNote())

	},

	createNote: function () {
		let createNoteForm = new FormData(document.querySelector('#createNote'))
		let tags = createNoteForm.tags.split(',').trim()
		return fetch("https://notes-api.glitch.me/api/notes", {
			method: 'POST',
			headers: {
				'Authorization': this.setAuthHeader()
			},
			body: JSON.stringify({ 'title': createNoteForm.title, 'text': createNoteForm.textyText, 'tags': tags })
		})
			.then(response => {
				if (response.ok) {
					this.getAllNotes()
				}
			})
			.catch(error => [
				console.log({ error })
			])
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
				app.data.nuggets = data
				this.render()
			})
	}
};

function showLoginForm() {
	document.getElementById('login').classList.remove('hidden')
	document.getElementById('notes').classList.add('hidden')
}

function hideLoginForm() {
	document.getElementById('login').classList.add('hidden')
	document.getElementById('notes').classList.remove('hidden')
}

function main() {
	// This is for the login process

	// TODO
	// check if logged in
	//   if so - app.getAllNotes()
	//         - also hide login form
	// else
	//    you good!

	const login = document.querySelector('#login');
	login.addEventListener('submit', (event) => {
		event.preventDefault();
		console.log({ app }, 'I am the first')
		const loginData = new FormData(login);
		const username = loginData.get('username');
		const password = loginData.get('password');
		console.log({ loginData }, { username }, { password });
		app.login(username, password);
		console.log({ app }, 'I am the second')
		app.getAllNotes();
		console.log({ app }, 'I am the third')
	});

}

main();
