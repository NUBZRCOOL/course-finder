import React from "react";


function App() {

	function submit(e: React.FormEvent<HTMLFormElement>) {

		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);

		const queryParams = new URLSearchParams();

		formData.forEach((value, key) => {
			queryParams.append(key, value.toString());
		});

		fetch(
			"https://course-finder-api-git-main-nubz-cools-projects.vercel.app/getCiC?" + queryParams.toString(),
			{ method: form.method }
		)
		.then(response => response.text())
		.then(data => {
			const element = document.getElementById("g");

			if (element) {
				element.innerHTML = data;
			} else {
				console.error("Element with id 'g' not found.");
			}
		})
	}
	

	return (

		<div>
			<form action="get" onSubmit={submit}>

				<label htmlFor="fullName">Type your full name: </label>
				<input type="text" name="fullName" id="fullName" />

				<button type="submit">Submit</button>

			</form>

			<p id="g"></p>
		</div>
	)
}

export default App;