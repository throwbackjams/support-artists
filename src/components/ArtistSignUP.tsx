import { FC, useState } from 'react';
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ArtistAccount } from "models/ArtistAccount";
import * as borsh from '@project-serum/borsh'

export const ArtistSignUp: FC = () => {
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [beneficiaryWalletAddress, setBeneficiaryWalletAddress] = useState("");

	const programID = new web3.PublicKey("Fm7tyJyJSCKZLijYMrgm86Ac8k7VJHANkrmV3q3eZaKv");

	const { publicKey, sendTransaction } = useWallet();
	const wallet = useWallet();
	const {connection} = useConnection();

	const opts: web3.ConfirmOptions = {
		preflightCommitment: "processed"
	}

	const getProvider = () => {
		const provider = new anchor.AnchorProvider(connection, wallet, opts);
		return provider;
	}

	const getProgram = async () => {
		// Get metadata about your solana program
		const idl = await anchor.Program.fetchIdl(programID, getProvider());
		// Create a program that you can call
		return new anchor.Program(idl, programID, getProvider());
	};


	const signUp = async (e) => {
		e.preventDefault();

		const program = await getProgram();

		console.log("name", name);
		console.log("about", about);
		console.log("beneficiary", beneficiaryWalletAddress);
		
		setName("");
		setAbout("");
		setBeneficiaryWalletAddress("");

		const beneficiaryPubkey = new web3.PublicKey(beneficiaryWalletAddress)

		const [artistStatePDA, ] = await web3.PublicKey 
		.findProgramAddress(
		  [
			anchor.utils.bytes.utf8.encode("artist-account"),
			wallet.publicKey.toBuffer()
		  ],
		  program.programId
		);
		
		console.log(artistStatePDA.toBase58())

		try {
            let txid = await program.methods
			.initializeArtist(name, about)
			.accounts({
			  initializer: publicKey,
			  artistState: artistStatePDA,
			  beneficiary: beneficiaryPubkey,
			})
			.rpc();
            alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }		
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
				<div className="mb-4">
					<label className="block text-white-700 text-sm font-bold mb-2">
						Wallet Address
					</label>
					<input className="shadow appearance-none bg-inherit  border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
						id="name" type="text" placeholder="Wallet Address"
						value={beneficiaryWalletAddress}
						onChange={(e) => setBeneficiaryWalletAddress(e.target.value)}
					/>
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
