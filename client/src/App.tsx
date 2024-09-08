import React, { useState } from "react";
import "./App.css"



interface Commoner {
	name: string;
	isAdmin: boolean;
	sharedCourses: number;
}

interface ApiResponse {
	message: string;
	commoners: Commoner[];
}

const App: React.FC = () => {

	const [data, setData] = useState<ApiResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);


	function submit(e: React.FormEvent<HTMLFormElement>) {

		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const queryParams = new URLSearchParams();

		formData.forEach((value, key) => {
			queryParams.append(key, value.toString());
		});
	

		setLoading(true);
		setError(null);

		fetch("https://course-finder-api.vercel.app/getCiC?" + queryParams.toString(), {
			method: form.method,
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			return response.json();
		})
		.then((data: ApiResponse) => {
			setData(data);
			setLoading(false);
		})
		.catch((error) => {
			setError(error.message);
			setLoading(false);
		});
  	}

  	return (

		<div id="body">
			<div id="formDiv">
				<form action="get" onSubmit={submit}>
					<label htmlFor="fullName"><strong>Type someone's full name: </strong></label>
					<br />
					<input type="text" name="fullName" id="fullName" required />
					<br />
					<button type="submit"><span>Submit</span></button>
				</form>
			</div>
			
			<br /><br /><br />

			{loading && <p>Loading...</p>}

			{error &&
				<p style={{ color: "red", fontSize: "25px" }}>
					<strong>Error: {error}</strong>
					<br />
					Please try again later
				</p>
			}

			{data && (
				<div>
					<h1>{data.message}</h1>
					{data.commoners.length < 0 ? (
						<p>No commoners found.</p>
					) : (
						<ul>
							{data.commoners.map((commoner, index) => (
								<li key={index}>
									<strong>{commoner.name}</strong> (Admin: {commoner.isAdmin ? "Yes" : "No"})<br />
									Shared Courses: {commoner.sharedCourses}
								</li>
							))}
						</ul>
					)}
				<br /><br />

				</div>
			)}
		</div>
  	);
};

export default App;