'use client';

import { useState } from 'react';
import { Database } from 'firebase/database';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import MoreVert from '@mui/icons-material/MoreVert';

import { IRoom } from '@/interfaces/IRoom';
import { RoomsService } from '@/services/roomsService';
import RoomDialog from './RoomDialog';

export const CLOSED = 'closed' as const;
export const CREATING = 'creating' as const;
export const EDITING = 'editing' as const;

type RoomsListProps = {
	db: Database;
	activeRoom: IRoom | null;
	rooms: IRoom[];
	setActiveRoom: (room: IRoom | null) => void;
};

export type DialogMode =
	| { type: typeof CLOSED; }
	| { type: typeof CREATING; }
	| { type: typeof EDITING; roomId: string; currentName: string; };

export default function RoomsList({ db, activeRoom, rooms, setActiveRoom }: RoomsListProps) {
	// const [isOpen, setIsOpen] = useState(false);
	// const [roomToEdit, setRoomToEdit] = useState<IRoom | null>(null);
	const roomsService = new RoomsService(db);
	const [dialogMode, setDialogMode] = useState<DialogMode>({ type: CLOSED });

	function handleCreateRoom() {
		setDialogMode({ type: CREATING });
	}

	function handleEditRoom(roomId: string, currentName: string) {
		setDialogMode({ type: EDITING, roomId, currentName });
	}

	async function handleSubmit(roomName: string, roomId?: string) {
		const trimmedRoomName = roomName.trim();
		if (roomId) {
			await roomsService.updateRoomName(roomId, trimmedRoomName);
		} else {
			await roomsService.createRoom(trimmedRoomName);
		}
	}

	async function deleteRoom(room: IRoom) {
		// need user role validation before allowing delete
		if (!room) return;
		await roomsService.deleteRoom(room.id);
	}

	function handleCloseDialog() {
		setDialogMode({ type: CLOSED });
	}

	return (
		<>
			<List>
				{rooms.map((room) => (
					<ListItem
						key={room.id}
						disableGutters
					>
						<ListItemButton
							onClick={() => setActiveRoom(room)}
						>
							{room.name}
						</ListItemButton>
						{/*
						TODO: implement menu for more options 
						<IconButton>
							<MoreVert />
						</IconButton> 
						*/}
						{/* icon button to edit */}
						<IconButton>
							<EditIcon
								onClick={() => handleEditRoom(room.id, room.name)}
							/>
						</IconButton>
						{/* icon button to delete */}
						<IconButton>
							<DeleteIcon
								onClick={() => deleteRoom(room)}
							/>
						</IconButton>
					</ListItem>
				))}
			</List>

			<Divider sx={{ borderColor: 'black' }} />
			{/* Create Room Section. Maybe a dialog? */}
			<Button
				variant={'contained'}
				endIcon={<AddIcon />}
				onClick={() => handleCreateRoom()}
			>
				Create Room
			</Button>

			<RoomDialog
				mode={dialogMode}
				handleCloseDialog={handleCloseDialog}
				handleSubmit={handleSubmit}
			/>
		</>
	);
}