import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SongTable from '../components/SongTable/SongTable';

const Playlist = ({ spotifyApi, token }) => {
	const [playlistInfo, setplaylistinfo] = useState();
	const [songs, setSongs] = useState([]);
	const [status, setStatus] = useState({ isLoading: true, isError: null });
	const { id } = useParams();

	const formatSongs = useCallback(
		(items) =>
			items.map((item, i) => {
				const { track } = item;
				track.contextUri = `spotify:playlist:${id}`;
				track.position = i;
				return track;
			}),
		[id]
	);
	useEffect(() => {
		const getData = async () => {
			setStatus({ isLoading: true, isError: null });
			try {
				const playlistDetails = await spotifyApi.getPlaylist(id);
				setplaylistinfo({
					image: playlistDetails.body.images[0].url,
					name: playlistDetails.body.name
				});
				const { items } = playlistDetails.body.tracks;
				// Format songs
				const formattedSongs = formatSongs(items);
				setSongs(formattedSongs);
			} catch (e) {
				console.error(e);
				setStatus({ isLoading: false, isError: e });
			}
		};

		getData().finally(() => {
			setStatus({ isLoading: false, isError: null });
		});
	}, [id, formatSongs, spotifyApi, token]);

	return (
		<Box id="Playlist__page" sx={{ backgroundColor: 'background.paper', flex: 1, overflowY: 'auto' }}>
			<Box
				p={{ xs: 3, md: 4 }}
				sx={{
					width: '100%',
					background: 'linear-gradient(0deg, #121212 0%, #1bd76060 100%);',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: { sx: 'flex-start', md: 'flex-end', xl: 'center' },
					gap: 3,
					boxSizing: 'border-box',
					flexDirection: { xs: 'column', md: 'row' }
				}}
			>
				{status.isLoading ? (
					<Skeleton
						variant="square"
						sx={{ width: { xs: '100%', md: 235 }, height: { xs: '100%', md: 235 } }}
					/>
				) : (
					<Avatar
						src={playlistInfo?.image}
						variant="square"
						alt={playlistInfo?.name}
						sx={{ boxShadow: 15, width: { xs: '100%', md: 235 }, height: { xs: '100%', md: 235 } }}
					/>
				)}
				<Box>
					<Typography sx={{ fontSize: 12, fontWeight: 'blod', color: 'text.primary' }}>Playlist</Typography>
					{status.isLoading ? (
						<Skeleton variant="text" sx={{ fontSize: { sx: 42, md: 72 }, width: 200 }} />
					) : (
						<Typography sx={{ fontSize: { sx: 42, md: 72 }, fontWeight: 'bold', color: 'text.primay' }}>
							{playlistInfo?.name}
						</Typography>
					)}
				</Box>
			</Box>
			<SongTable songs={songs} loading={status.isLoading} spotifyApi={spotifyApi} />
		</Box>
	);
};

export default Playlist;
