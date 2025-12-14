'use client';

import { useEffect, useRef } from 'react';
import { IChatMessage } from '@/interfaces/IChatMessage';
import ChatMessage from './ChatMessage';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type MessagesListProps = {
	hasMoreMessages: boolean;
	isLoadingMessages: boolean;
	messages: IChatMessage[];
	loadMoreMessages: () => void;
};

export default function MessagesList({
	hasMoreMessages,
	isLoadingMessages,
	messages,
	loadMoreMessages
}: MessagesListProps) {
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const target = entries[0];
				if (target.isIntersecting && hasMoreMessages && !isLoadingMessages) {
					loadMoreMessages();
				}
			},
			{
				threshold: 0.1,
				rootMargin: '20px',
			}
		);

		const loadMoreButton = loadMoreButtonRef.current;

		if (loadMoreButton) {
			observer.observe(loadMoreButton);
		}

		return () => {
			if (loadMoreButton) {
				observer.unobserve(loadMoreButton);
			}
		};
	}, [hasMoreMessages, isLoadingMessages, loadMoreMessages]);

	if (messages.length === 0 && !isLoadingMessages) {
		return (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<Typography variant={'body1'} color={'text.secondary'}>
					No messages yet. Start the conversation!
				</Typography>
			</Box>
		);
	}

	return (
		<Stack
			ref={messagesContainerRef}
			display={'flex'}
			flex={1}
			spacing={3}
			border={'1px solid rgba(0 0 0 / 0.23)'}
			borderRadius={2}
			mb={3}
			p={2}
			justifyContent={'flex-end'}
		>
			{messages.map(message => (
				<ChatMessage
					key={message.id}
					message={message}
				/>
			))}

			{hasMoreMessages && (
				<Box>
					{isLoadingMessages ? (
						<CircularProgress size={24} />
					) : (
						<Button
							ref={loadMoreButtonRef}
							variant={'contained'}
							onClick={loadMoreMessages}
							size={'small'}
						>
							Load More Messages
						</Button>
					)}
				</Box>
			)}
		</Stack>
	);
}