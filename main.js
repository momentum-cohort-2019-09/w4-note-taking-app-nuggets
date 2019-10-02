function main() {
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
		// Fetching naturally GETs information out, so we have to set the POST.
		fetch('https://notes-api.glitch.me/api/users', {
			method: POST
		})
			.then((response) => response.json())
			.then((data) => {});
	});
}

main();
