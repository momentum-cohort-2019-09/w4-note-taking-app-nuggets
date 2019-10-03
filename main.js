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

		fetch('https://notes-api.glitch.me/api/notes', {
			method: 'GET'
		});
	});
}

const app = {
	data: {
		credientials: {
			username: sessionStorage.getItem('username'),
			password: sessionStorage.getItem('password')
		},
		notes: []
	}
};

class App {
	constructor(user) {
		this.user = user;
	}
	createNote() {}

	getAllNotes() {}
}

class User {
	constructor(username, password) {
		this.username = username;
		this.password = password;
		this.auth = 'Basic ' + btoa(username + ':' + password);
	}

	getUsername() {
		return this.username;
	}

	getPassword() {
		return this.password;
	}

	getAuth() {
		return this.auth;
	}
}

fetch('https://notes-api.glitch.me/api/notes', {
	method: 'GET',
	header: {
		Authorization: 'Basic ' + btoa(app.data.credientials.username + ':' + app.data.credientials.password)
	}
});

main();
