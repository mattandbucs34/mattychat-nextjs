import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MessagesList from './MessagesList';

import { IChatMessage } from '@/interfaces/IChatMessage';
import { IRoom } from '@/interfaces/IRoom';
import SendMessageInput from './SendMessageInput';

type MessagesViewProps = {
	room: IRoom | null;
	hasMoreMessages: boolean;
	isLoadingMessages: boolean;
	messages: IChatMessage[];
	handleNewMessageSubmit: (message: string) => void;
	loadMoreMessages: () => void;
};

export default function MessagesView({
	hasMoreMessages,
	isLoadingMessages,
	messages,
	room,
	handleNewMessageSubmit,
	loadMoreMessages,
}: MessagesViewProps) {
	return (
		<Stack width={'100%'} pt={2} pb={4}>
			<Box component={'header'}>
				<Typography variant={'h3'}>
					{`${room?.name} Messages`}
				</Typography>
			</Box>
			<MessagesList
				hasMoreMessages={hasMoreMessages}
				isLoadingMessages={isLoadingMessages}
				messages={messages}
				loadMoreMessages={loadMoreMessages}
			/>
			<SendMessageInput
				handleNewMessageSubmit={handleNewMessageSubmit}
			/>
		</Stack>
	);
}