'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { User } from 'firebase/auth';

type UserActionProps = {
	user: User | null;
	handleAuthAction: () => void;
}

export default function UserAction({ user, handleAuthAction }: UserActionProps) {

	return (
		<Box>
			<Typography variant={'body1'}>
				{`Welcome ${user ?? 'Guest'}`}
			</Typography>
			<Button
				variant={'contained'}
				onClick={handleAuthAction}
			>
				{user ? 'Sign Out' : 'Sign In'}	
			</Button>
		</Box>
	);
}
