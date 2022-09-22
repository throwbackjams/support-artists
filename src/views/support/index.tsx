import { FC, useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ArtistAccount } from "models/ArtistAccount";
import * as borsh from '@project-serum/borsh'
import { BorshAccountsCoder, BorshInstructionCoder } from "@project-serum/anchor";

export const SupportView: FC = ({ }) => {
	const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
	const [artists, setArtists] = useState<ArtistAccount[]>([])
	const wallet = useWallet();


	const programID = new web3.PublicKey("Fm7tyJyJSCKZLijYMrgm86Ac8k7VJHANkrmV3q3eZaKv");


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

	// const initialize = async () => {
	// 	try {
	// 		const provider = getProvider();
	// 		const program = getProgram();

	// 		console.log("ding");

	// 		const name: string = "MLH Fellow - Jimii";
	// 		const about: string = "I'm an incredible artist and you should support me. Thank you!"

	// 		const [artistStatePDA,] = await PublicKey
	// 			.findProgramAddress(
	// 				[
	// 					anchor.utils.bytes.utf8.encode("artist-account"),
	// 					initializer.publicKey.toBuffer()
	// 				],
	// 				programID
	// 			);
	// 		await (await program).methods.initializeArtist(name, about).accounts({
	// 			initializer: initializer.publicKey,
	// 			artistState: artistStatePDA,
	// 			beneficiary: beneficiary.publicKey
	// 		})
	// 			.signers([initializer])
	// 			.rpc();

	// 		console.log("Created a new BaseAccount w/ address:", initializer.publicKey.toString());
	// 		await fetchArtists();
	// 	} catch (err) {
	// 		console.error("error initializing the program ->", err);
	// 	}
	// }

	const fetchArtists = async () => {
		try {
			const program = await getProgram();

			const coder = new BorshAccountsCoder(program.idl);

			const artistState = await program.account.artist.fetch(new web3.PublicKey("H7SgXgzjibJ6N3fnd9WbQ2BVLKyTqZWS3vgodGff7raL"))
			console.log("Artist state: ", artistState)

			const accounts = connection.getProgramAccounts(programID).then(async (accounts) => {
				console.log("Accounts: ", accounts)
				let artists = []
				accounts.map(async (accountObject) => {
					let accountPubkey = new web3.PublicKey(accountObject.pubkey.toBase58())
					console.log("Account Pubkey: ", accountPubkey.toBase58())
					try {

						let artistAccountData = await program.account.artist.fetch(accountPubkey)
						console.log("Artist account data", artistAccountData)
						let artist = new ArtistAccount(artistAccountData.name, artistAccountData.about, artistAccountData.wallet, artistAccountData.bump)
						artists.push(artist)
						console.log("Artist Account: ", artist)

					} catch (error) {
						console.log("Account deserialization error for Account: ", accountPubkey.toBase58())
						console.log("Error: ",error)
					}
					setArtists(artists)
				})
			})

			console.log("Artists", artists)
			// const accounts = connection.getProgramAccounts(programID).then(async (accounts) => {
			// 	console.log(accounts)
			// 	const artists: ArtistAccount[] = accounts.map((accountObject) => {

			// 		let accountPubkey = new web3.PublicKey(accountObject.pubkey.toBase58())
			// 		console.log("Account Pubkey: ", accountPubkey)
			// 		let artistAccountData = program.account.artist.fetch(accountPubkey)
			// 		console.log("Artist account data", artistAccountData)

			// 		// let decodedAccountData = coder.decode("Artist", account.data)
		
			// 		// // const artist = program.account.Artist.fetch(new web3.PublicKey(object.pubkey.toBase58()))

			// 		const deserializedData = ArtistAccount.deserialize(accountObject.account.data)
			// 		console.log(deserializedData)
			// 		return deserializedData
			// 	})

			// 	setArtists(artists)

			// })
		} catch (err) {
			console.error("encountered error fetching artists\n", err);
		}
	}

	useEffect(() => {
		console.log("Fetching artists")
		fetchArtists()
	}, []);

	// initialize().then().catch(err => console.log("error initing stuff"));

	return (
		<div className="md:hero mx-auto p-4">
			<div className="md:hero-content flex flex-col">
				<h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
					Support An Artist
				</h1>
				{/* CONTENT GOES HERE */}
				<div className="text-center">
					{artists.map(artist => {
						return <div>{`Artist Name: ${artist.name}`}<br></br>
						{`Artist about: ${artist.about}`}<br></br>
						{`Artist Wallet: ${artist.wallet}`}
						</div>
					})}
				</div>
			</div>
		</div>
	);
};
