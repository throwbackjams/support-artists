import { FC } from 'react';
import { ChangeEventHandler } from 'react';

interface cardProps {
	name: string,
	about: string,
	supportArtistFn: () => void
	inputOnChangeFn: (e) => void/* ChangeEventHandler<HTMLInputElement> */
}

export const ArtistCard: FC<cardProps> = ({ name, about, supportArtistFn, inputOnChangeFn }) => {

	return (
		<div className="card w-64 bg-base-100 shadow-xl border-2 border-white-600 my-10">

			<div className="card-body items-center text-center">
				<h2 className="card-title">{name}</h2>
				<p>{about}</p>
				<div className="card-actions flex justify-center">
					<div className='items-center'>
						<input onChange={inputOnChangeFn} className='text-center bg-transparent md:w-32 border rounded-sm' placeholder='enter amt sol' />
					</div>
					<div>
						<button onClick={supportArtistFn} className="btn btn-primary">Support Artist</button>
					</div>
				</div>
			</div>
		</div>
	);
};
