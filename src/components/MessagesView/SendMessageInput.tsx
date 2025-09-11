import { ChangeEvent, FormEvent, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

type SendMessageInputProps = {
	handleNewMessageSubmit: (message: string) => void; // Define props if needed
}; // Define props if needed

export default function SendMessageInput({ handleNewMessageSubmit }: SendMessageInputProps) { // Define props if needed
	const [message, setMessage] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleNewMessageSubmit(message);
        setMessage('');
    };

	return (
		<form onSubmit={handleSubmit}>
			<Stack direction={'row'} gap={3}>
				<TextField
					variant={'outlined'}
					fullWidth
					placeholder={'Type your message...'}
					value={message}
					onChange={
						(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)
					}
				/>
				<Button
					variant={'contained'}
					type={'submit'}
				>
					Send
				</Button>
			</Stack>
		</form>
	);
}