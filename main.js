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
	});
}

const app = {
	data: {
		credientials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		notes: []
	},

	getAuthHeader() {
		// This will auto populate the header for when we need authorization
		// Easiability is nioce
	},

	setCredientials: function (username, password) {
		this.data.credientials = {
			username: username,
			password: password
		};
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},

	login: function (username, password) {
		fetch('https://notes-api.glitch.me/api/users', {
			headers: {
				'Authorization': 'Basic ' + btoa(`${username}:${password}`)
			}
		}).then(response => {
			if (response.ok) {
				this.setCredientials(username, password);
				document.querySelector('#login').classList.remove('input-invalid');
				// Need a way to then render the notes for this given user,
				// because the login was successful.
			} else {
				document.querySelector('#login').classList.add('input-invalid');
				document.querySelector('#error').innerText = 'That is not a valid username and password.';
			}
		});
	},

	getAllNotes: function () {
		fetch('https://notes-api.glitch.me/api/notes', {
			headers: {
				Authoritization:
					'Basic ' + btoa(`${this.data.credientials.username}:${this.data.credientials.password}`)
			}
		})
			.then((response) => {
				if (response.status === 401) {
					// What if yknow
				} else {
					return response.json();
				}
			})
			.then((response) => {
				if (response.ok) {
					document.getElementByID('note').innerHTML = data.map(generateNoteHTML).join('/n');
				}
			})
			.catch((error) => { });
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
		// Needs to be able to get the tags given the clicked tag. Probably an eventListener? (For sure a later idea)
		// Using GET with https://notes-api.glitch.me/api/notes/tagged/:tag
	}
};

main();
