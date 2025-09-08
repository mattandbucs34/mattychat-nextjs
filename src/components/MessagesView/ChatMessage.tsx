import { IChatMessage } from '@/interfaces/IChatMessage';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

type ChatMessageProps = {
	message: IChatMessage
}

export default function ChatMessage({ message }: ChatMessageProps) {
	const { username, content, sentAt } = message;
	return (
		<Box>
			<Typography variant={'body1'}>
				{content}
			</Typography>
			<Typography variant={'caption'}>
				{`From: ${username} at ${new Date(sentAt).toLocaleDateString()}`}
			</Typography>
		</Box>
	);
}