import { FC, useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ArtistAccount } from "models/ArtistAccount";
import * as borsh from '@project-serum/borsh'
import { BorshAccountsCoder, BorshInstructionCoder } from "@project-serum/anchor";

import { ArtistCard } from "components/ArtistCard";

import { notify } from "utils/notifications";

export const SupportView: FC = ({ }) => {
	const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
	const [artists, setArtists] = useState<ArtistAccount[]>([]);
	const [SupportAmt, setSupportAmt] = useState("");
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
						console.log("Error: ", error)
					}
					setArtists(artists)
				})
			})

			console.log("Artists", artists)
		} catch (err) {
			console.error("encountered error fetching artists\n", err);
		}
	}

	//function responsible for transfer of sol to artist
	const supportArtist = async (address) => {
		if (SupportAmt === "") {
			notify({ type: 'error', message: 'Please fill in amount!' });
			return;
		}
		let amt = 1_000_000 * Number(SupportAmt);

		// Create Simple Transaction
		let transaction = new web3.Transaction();

		// Add an instruction to execute
		transaction.add(web3.SystemProgram.transfer({
			fromPubkey: wallet.publicKey,
			toPubkey: address,
			lamports: 1_000_000_000 * Number(SupportAmt),
		}));

		let signature = await wallet.sendTransaction(transaction, connection);
		console.log('signature', signature);
		notify({ type: 'success', message: 'Transaction successful!', txid: signature });
	}

	useEffect(() => {
		console.log("Fetching artists");
		fetchArtists();
	}, []);

	return (
		<div className="md:hero mx-auto p-4">
			<div className="md:hero-content flex flex-col">
				<h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
					Support An Artist
				</h1>
				{/* CONTENT GOES HERE */}

				<div>
					{artists.map(artist => {
						return <ArtistCard key={artist.wallet}
							name={artist.name}
							about={artist.about}
							supportArtistFn={() => supportArtist(artist.wallet)}
							inputOnChangeFn={(e) => setSupportAmt(e.target.value)}
						/>
					})}
				</div>

				{/* 
				<div>
					<ArtistCard
						name="Jimii"
						about="support me I am awesome"
						supportArtistFn={() => supportArtist("935zXBkdmdCFxm7zukfpGXCEsh9DRYSCWpSoTVuq7QZa")}
						inputOnChangeFn={(e) => setSupportAmt(e.target.value)}
					/>
				</div> */}

			</div>
		</div>
	);
};
