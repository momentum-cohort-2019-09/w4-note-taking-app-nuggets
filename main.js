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

		return 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
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
					<h3 class="title">${note.title}</h3>
					<p class="text">${note.text}</p>
					<ul class="tag-list">
						${tags}
					</ul>
				</div>
			`
			document.querySelector('#replacement').innerHTML = templateLiteral
		}
		let tagNodes = document.querySelectorAll(".tag")
		console.log({ tagNodes })
		for (let tag of tagNodes) {
			tag.addEventListener('click', event => {
				console.log({ tag })
				this.getTaggedNotes(tag.innerText)
			})
		}
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
	// This is for the login process
	const login = document.querySelector('#login');
	document.querySelector('#login').addEventListener('submit', (event) => {
		event.preventDefault();

		// Must initially grab the form
		const loginData = new FormData(login);
		// We are getting these via their -name- attributes.
		// Throw some console logs below for clarification.
		// Not sure if it being called loginData is confusing,
		// but we can set it back to formData if that is more readable.
		const username = loginData.get('username');
		const password = loginData.get('password');
		console.log({ loginData }, { username }, { password });
		app.login(username, password);
		app.getAllNotes();
		// How do we grab a specific tag that is clicked?
	});

}

main();
