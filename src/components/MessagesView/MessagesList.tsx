'use client';

import { useEffect, useRef } from 'react';
import { IChatMessage } from '@/interfaces/IChatMessage';
import ChatMessage from './ChatMessage';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';

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
            <Box 
				sx={{
					textAlign: 'center',
					py: 4,
					flexGrow: 1
				}}
			>
                <Typography variant={'body1'} color={'text.secondary'}>
                    No messages yet. Start the conversation!
                </Typography>
            </Box>
        );
    }

	return (
		<Box
			ref={messagesContainerRef}
			display={'flex'}
			flex={1}
			id={'message-box'}
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
		</Box>
	);
}