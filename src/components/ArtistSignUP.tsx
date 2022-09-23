import { FC, useState } from 'react';

export const ArtistSignUp: FC = () => {
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");

	const signUp = async (e) => {
		e.preventDefault();

		console.log("name", name);
		console.log("about", about);
		
		setName("");
		setAbout("");
	}


	return (
		<div className="w-full max-w-xs">
			<form className="bg-white bg-inherit shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<div className="mb-4">
					<label className="block text-white-700 text-sm font-bold mb-2">
						Name
					</label>
					<input className="shadow appearance-none bg-inherit  border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
						id="name" type="text" placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div mb-6>
					<label className="block text-white-700 text-sm font-bold mb-2">
						About
					</label>
					<textarea className="textarea border textarea-bordered w-full" id="bio" placeholder="Bio" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
				</div>
				<div className="flex items-center justify-center mt-4">

					<button
						className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
						onClick={signUp}
					>
						<span>Sign Up </span>
					</button>
				</div>
			</form>
			<p className="text-center text-gray-500 text-xs">
				&copy;2022 Acme Corp. All rights reserved.
			</p>
		</div>
	);
};
