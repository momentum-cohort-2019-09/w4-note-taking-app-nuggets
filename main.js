const app = {
	data: {
		credentials: {
			username: 'charlie'/*sessionStorage.getItem('username')*/,
			password: 'mypass'/*sessionStorage.getItem('password')*/
		},
		nuggets: []
	},
	setAuthHeader: function (headers) {
		let username = this.data.credentials.username
		let password = this.data.credentials.password
		console.log({ username, password })
		return 'Basic ' + btoa(`${this.data.credentials.username}:${this.data.credentials.password}`)
	},

	setCredentials: function (username, password) {
		this.data.credentials = {
			'username': username,
			'password': password
		};
		console.log({ username, password })
		sessionStorage.setItem('username', username);
		sessionStorage.setItem('password', password);
	},


	login: function (username, password) {
		fetch('https://notes-api.glitch.me/api/notes', {
			headers: {
				'Authorization': 'Basic ' + btoa(`${username}:${password}`)
			}
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
				app.data.nuggets = data
				app.render()
			})
	},

	render: function () {
		document.querySelector('#createNote').classList.remove('hidden')
		let createNote = document.querySelector('#createNote')
		if (!createNote) {
			document.querySelector('#createNote').innerHTML = `
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
				`
		}

		this.replaceCreateNote()

		let templateLiteral = ``
		let noteIds = []
		let Nuggets = app.data.nuggets.notes
		console.log(Nuggets)
		console.log(app)
		for (let note of app.data.nuggets.notes) {
			console.log(note)
			tags = ``
			for (let tag of note.tags) {
				tags += `
				<button class="tag">${tag}</button>
				`
			}
			let noteID = note._id
			templateLiteral += `
				<div class="note" data-id="${note._id}">
					<h4 class="title">${note.title}</h4>
					<p class="text">${note.text}</p>
					<ul class="tag-list">
						${tags}
					</ul>
					<button type="button" class="update">Edit</button>
					<button type="button" class="delete">Delete</button>
				</div> 
			`
			document.querySelector('#notes').innerHTML = templateLiteral
		}

		let tagNodes = document.querySelectorAll(".tag")
		this.tagEvents(tagNodes)

		let deleteNodes = document.querySelectorAll('.delete')
		this.deleteEvents(deleteNodes)


		let editNodes = document.querySelectorAll('.update')
		this.editEvents(editNodes)


	},

	tagEvents: function (tags) {
		for (let tag of tags) {
			tag.addEventListener('click', event => {
				event.preventDefault()
				this.getTaggedNotes(tag.innerText)
			})
		}
	},

	deleteEvents: function (deletes) {
		for (let deleteNode of deletes) {
			deleteNode.addEventListener('click', event => {
				event.preventDefault()
				let parent = deleteNode.parentNode
				let id = deleteNode.parentNode.dataset.id
				this.deleteNote(deleteNode.parentNode.dataset.id)
			})
		}
	},

	editEvents: function (edits) {
		for (let editNode of edits) {
			editNode.addEventListener('click', event => {
				event.preventDefault()
				let parent = editNode.parentElement
				this.replaceCreateWithEdit(parent)
			})
		}
	},

	createNote: function (title, text, tags) {
		let tagsSplit = tags.split(' ').map(tag => tag)
		console.log({ tagsSplit })
		fetch("https://notes-api.glitch.me/api/notes", {
			method: 'POST',
			body: JSON.stringify({ "title": title, "text": text, "tags": tagsSplit }),
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
			.catch(error => [
				console.log({ error })
			])
	},

	replaceCreateNote: function () {
		let newCreateNote = document.querySelector('#createNote')
		newCreateNote.innerHTML = `
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
		`

		let submitNote = document.querySelector('#submitNote')
		submitNote.addEventListener('click', event => {
			event.preventDefault()
			let title = document.querySelector('#titleText').value
			let textyText = document.querySelector('#textyText').value
			let tags = document.querySelector('#tags').value
			console.log({ tags }, { textyText }, { title })
			app.createNote(title, textyText, tags)
		})
	},

	replaceCreateWithEdit: function (parent) {
		let templateLiteral = `
						<div class='input-field'>
							<label for='title'>Title:</label>
							<input value="${parent.children[0].innerText}" id='titleText' type='text' name="title" placeholder="Put title here">
						</div>
						<div class='input-field'>
							<label for='text'>Text:</label>
							<textarea value="" id='textyText' type='text' name="text-area" placeholder="Put description here">${parent.children[1].innerText}</textarea>
						</div>
						<div class='input-field'>
							<label for='tag'>Tag:</label>
							<input value="${parent.children[2].innerText}" id="tags" type="text" name="tag" placeholder="Separate with space">
						</div>
						<button id="editNote" type='submit' value='submit'>Edit Note</button>
					`

		document.querySelector('#createNote').innerHTML = templateLiteral
		document.querySelector('#editNote').addEventListener('click', event => {
			event.preventDefault()
			let edit = document.querySelector('#createNote')
			let id = parent.dataset.id
			this.updateNote(parent.dataset.id, edit)
		})
	},

	updateNote: function (noteID, parent) {
		let title = parent[0].value
		let text = parent[1].value
		let tags = parent[2].value.split(' ')
		for (let tag of tags) {
			if (tag === '') {
				tags.splice(tags.indexOf(tag), 1)
			} else {
				tag.trim()
			}
		}

		console.log({ noteID })
		console.log({ tags })

		fetch(`https://notes-api.glitch.me/api/notes/${noteID}`, {
			method: 'PUT',
			body: JSON.stringify({ "title": title, "text": text, "tags": tags }),
			headers: {
				Authorization: this.setAuthHeader(),
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

	deleteNote: function (noteID) {
		fetch(`https://notes-api.glitch.me/api/notes/${noteID}`, {
			method: 'DELETE',
			headers: {
				Authorization: this.setAuthHeader()
			}
		})
			.then(response => {
				if (response.ok) {
					app.data.notes = app.data.nuggets.notes.filter((note) => note._id !== noteID)
					app.getAllNotes()
				}
			})
	},

	getTaggedNotes: function (tag) {
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
		const loginData = new FormData(login);

		const username = loginData.get('username');
		const password = loginData.get('password');
		console.log({ username, password })

		app.login(username, password);
		app.getAllNotes();

	});

	let submitNote = document.querySelector('#submitNote')
	submitNote.addEventListener('submit', event => {
		event.preventDefault()
		let title = document.querySelector('#titleText').value
		let textyText = document.querySelector('#textyText').value
		let tags = document.querySelector('#tags').value
		console.log({ tags }, { textyText }, { title })
		app.createNote(title, textyText, tags)
	})
}

main();