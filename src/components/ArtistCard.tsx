import { FC } from 'react';
import Link from "next/link";

interface cardProps {
	name: string,
	about: string,
	supportArtistFn: () => void
}

export const ArtistCard: FC<cardProps> = ({ name, about, supportArtistFn }) => {

	return (
		<div className="card w-64 bg-base-100 shadow-xl border-2 border-white-600 my-10">

			<div className="card-body items-center text-center">
				<h2 className="card-title">{name}</h2>
				<p>{about}</p>
				<div className="card-actions">
					<button onClick={supportArtistFn} className="btn btn-primary">Support Artist</button>
				</div>
			</div>
		</div>
	);
};
