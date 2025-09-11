'use client';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { User } from 'firebase/auth';

type UserActionProps = {
	user: User | null;
	handleAuthAction: () => void;
}

export default function UserAction({ user, handleAuthAction }: UserActionProps) {

	return (
		<Stack gap={1}>
			<Typography variant={'body1'}>
				{`Welcome ${user ?? 'Guest'}`}
			</Typography>
			<Button
				variant={'contained'}
				onClick={handleAuthAction}
			>
				{user ? 'Sign Out' : 'Sign In'}	
			</Button>
			<Divider sx={{ borderColor: 'black' }} />
		</Stack>
	);
}
