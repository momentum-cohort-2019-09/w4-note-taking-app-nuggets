const app = {
	data: {
		credentials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		notes: []
	},
	setAuthHeader: function (headers) {
		// This will auto populate the header for when we need authorization
		// Easiability is nioce
		if (!headers) {
			header = {}
		}

		return 'Basic ' + btoa(`${this.data.credientials.username}:${this.data.credientials.password}`)
	},

	setCredentials: function (username, password) {
		this.data = {};
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
				'Authorization': 'Basic ' + btoa(`${username}:${password}`)
			}
		}).then(response => {
			if (response.ok) {
				this.setCredentials(username, password);
				document.querySelector('#login').classList.remove('input-invalid');
				// Append all notes to the this.data.notes array

				// Need a way to then render the notes for this given user,
				// because the login was successful.
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
				this.data.notes = data
				console.log({ data })
			})
	},

	updateNote: function (note /* Right? */) {
		// Needs to be able to take the given note and update title, text, and tags
		// Using PUT with https://notes-api.glitch.me/api/notes/:id
	},

	deleteNote: function (note) {
		// Needs to be able to DELETE a given note from the users notes array
		// Then also DELETE the note from the API as well.
		// Using DELETE with https://notes-api.glitch.me/api/notes/:id
	},

	getTaggedNotes: function (tag) {
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

main();
