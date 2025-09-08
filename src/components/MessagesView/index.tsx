import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MessagesList from './MessagesList';
import { IChatMessage } from '@/interfaces/IChatMessage';

type MessagesViewProps = {
	hasMoreMessages: boolean;
	isLoadingMessages: boolean;
	messages: IChatMessage[];
	loadMoreMessages: () => void;
};

export default function MessagesView({
	hasMoreMessages,
	isLoadingMessages,
	messages,
	loadMoreMessages,
}: MessagesViewProps) {
	return (
		<Box component={'header'}>
			<Typography variant={'h3'}>Messages</Typography>
			<MessagesList
				hasMoreMessages={hasMoreMessages}
				isLoadingMessages={isLoadingMessages}
				messages={messages}
				loadMoreMessages={loadMoreMessages}
			/>
		</Box>
	);
}