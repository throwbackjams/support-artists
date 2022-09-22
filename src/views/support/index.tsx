import { FC } from "react";
import { Keypair, ConfirmOptions, PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const SupportView: FC = ({ }) => {
	const wallet = useWallet();
	const { connection } = useConnection();

	let initializer = Keypair.generate();
	const beneficiary = anchor.web3.Keypair.generate();

	const programID = new PublicKey("Fm7tyJyJSCKZLijYMrgm86Ac8k7VJHANkrmV3q3eZaKv");


	const opts: ConfirmOptions = {
		preflightCommitment: "processed"
	}

	const getProvider = () => {
		const provider = new anchor.AnchorProvider(connection, wallet, opts.preflightCommitment);
		return provider;
	}

	const getProgram = async () => {
		// Get metadata about your solana program
		const idl = await anchor.Program.fetchIdl(programID, getProvider());
		// Create a program that you can call
		return new anchor.Program(idl, programID, getProvider());
	};

	const initialize = async () => {
		try {
			const provider = getProvider();
			const program = getProgram();

			console.log("ding");

			const name: string = "MLH Fellow - Jimii";
			const about: string = "I'm an incredible artist and you should support me. Thank you!"

			const [artistStatePDA,] = await PublicKey
				.findProgramAddress(
					[
						anchor.utils.bytes.utf8.encode("artist-account"),
						initializer.publicKey.toBuffer()
					],
					programID
				);
			await (await program).methods.initializeArtist(name, about).accounts({
				initializer: initializer.publicKey,
				artistState: artistStatePDA,
				beneficiary: beneficiary.publicKey
			})
				.signers([initializer])
				.rpc();

			console.log("Created a new BaseAccount w/ address:", initializer.publicKey.toString());
			await fetchArtists();
		} catch (err) {
			console.error("error initializing the program ->", err);
		}
	}

	const fetchArtists = async () => {
		try {
			const program = await getProgram();

			const acc = await program.account.artist.fetch(initializer.publicKey);

			console.log('account found', acc);
		} catch (err) {
			console.error("encountered error fetching artists\n", err);
		}
	}

	// initialize().then().catch(err => console.log("error initing stuff"));

	return (
		<div className="md:hero mx-auto p-4">
			<div className="md:hero-content flex flex-col">
				<h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
					Support An Artist
				</h1>
				{/* CONTENT GOES HERE */}
				<div className="text-center">
					//
				</div>
			</div>
		</div>
	);
};
