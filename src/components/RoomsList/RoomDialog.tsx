'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { CLOSED, CREATING, DialogMode } from '.';

type RoomDialogProps = {
	mode: DialogMode;
	handleCloseDialog: () => void;
	handleSubmit: (_editedRoomName: string) => void;
};

export default function RoomDialog({
	mode,
	handleCloseDialog,
	handleSubmit
}: RoomDialogProps) {
	const [editedRoomName, setEditedRoomName] = useState('');

	const isOpen = mode.type !== CLOSED;
	const isCreating = mode.type === CREATING;
	const title = isCreating ? 'Create New Room' : 'Edit Room Name';

	return (
		<Dialog open={isOpen}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<Box component={'form'}>
					<TextField
						autoFocus
						required
						id={'room-name'}
						label={'Room Name'}
						fullWidth
						variant={'standard'}
						onChange={(e) => setEditedRoomName(e.target.value)}
						value={editedRoomName}
					/>
				</Box>

			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDialog}>
					Cancel
				</Button>
				<Button
					onClick={() => handleSubmit(editedRoomName)}
				>
					{isCreating ? 'CREATE' : 'SAVE'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}