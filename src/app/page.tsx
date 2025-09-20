'use client';

import { useCallback, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, AuthError, User } from 'firebase/auth';
import { endBefore, get, getDatabase, limitToLast, onValue, orderByChild, push, query, ref, serverTimestamp } from 'firebase/database';

import MessagesView from '@/components/MessagesView';
import RoomsList from '@/components/RoomsList';
import UserAction from '@/components/UserAction';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { IRoom } from '@/interfaces/IRoom';
import { IChatMessage } from '@/interfaces/IChatMessage';
import { grey } from '@mui/material/colors';

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const firebase = initializeApp(firebaseConfig);
const firebaseDb = getDatabase(firebase);
const auth = getAuth(firebase);
const provider = new GoogleAuthProvider();

const MAX_MESSAGES_LIMIT = 20;

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<IRoom | null>(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState(null);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

    // monitor auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // monitor chat rooms
    useEffect(() => {
        const roomsRef = ref(firebaseDb, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomsArray = Object.keys(data).map((key) => ({
                    id: key,
                    name: data[key].name,
                }));
                setActiveRoom(roomsArray[0] ?? null);
                setRooms(roomsArray);
            } else {
                setActiveRoom(null);
                setRooms([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (activeRoom) {
            loadIniitalMessages(activeRoom.id);
        } else {
            setMessages([]);
            setHasMoreMessages(true);
            setOldestMessageTimestamp(null);
        }
    }, [activeRoom]);

    // handle sign in and sign out
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            if (error
                && typeof error === 'object'
                && 'code' in error) {
                const authError = error as AuthError;
                const errorCode = authError.code;
                const errorMessage = authError.message;
                const email = authError.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(authError);
                console.error('Error during sign in:', { errorCode, errorMessage, email, credential });
            }
        }
    };

    const signOut = async () => {
        await auth.signOut();
    };

    function handleAuthAction() {
        if (!user) {
            signInWithGoogle();
        }

        // sign in logic
        signOut();
    }

    async function loadIniitalMessages(roomId: string) {
        setIsLoadingMessages(true);
        setMessages([]);
        setOldestMessageTimestamp(null);
        setHasMoreMessages(true);

        try {
            const messagesRef = ref(firebaseDb, `messages/${roomId}`);
            const messagesQuery = query(
                messagesRef,
                orderByChild('sentAt'),
                limitToLast(MAX_MESSAGES_LIMIT)
            );

            const snapshot = await get(messagesQuery);
            const data = snapshot.val();

            if (data) {
                const messagesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }))
                    .sort((a, b) => b.sentAt = a.sentAt);

                setMessages(messagesArray);

                if (messagesArray.length > 0) {
                    setOldestMessageTimestamp(messagesArray[messagesArray.length - 1].sentAt);
                }

                setHasMoreMessages(messagesArray.length === MAX_MESSAGES_LIMIT);
            } else {
                setMessages([]);
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }

    const loadMoreMessages = useCallback(async () => {
        if (!activeRoom || !oldestMessageTimestamp || isLoadingMessages || !hasMoreMessages) {
            return;
        }

        setIsLoadingMessages(true);

        try {
            const messagesRef = ref(firebaseDb, `messages/${activeRoom.id}`);
            const messagesQuery = query(
                messagesRef,
                orderByChild('sentAt'),
                limitToLast(MAX_MESSAGES_LIMIT),
                endBefore(oldestMessageTimestamp)
            );

            const snapshot = await get(messagesQuery);
            const data = snapshot.val();

            if (data) {
                const nextMessagesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }))
                    .sort((a, b) => b.sentAt = a.sentAt);

                if (nextMessagesArray.length > 0) {
                    setMessages(prevMessages => [...prevMessages, ...nextMessagesArray]);
                    setOldestMessageTimestamp(nextMessagesArray[nextMessagesArray.length - 1].sentAt);
                    setHasMoreMessages(nextMessagesArray.length === MAX_MESSAGES_LIMIT);
                } else {
                    setHasMoreMessages(false);
                }
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [activeRoom, oldestMessageTimestamp, isLoadingMessages, hasMoreMessages]);

    const handleNewMessageSubmit = (message: string) => {
        const messagesRef = ref(firebaseDb, 'messages');
        push(messagesRef, {
            content: message,
            sentAt: serverTimestamp(),
            username: user?.displayName || 'Guest',
            roomId: activeRoom?.id,
        })
    }

    return (
        <Container maxWidth={'lg'}>
            <Grid
                container
                direction={'column'}
                minHeight={'100vh'}
            >
                <Box
                    component={'header'}
                    pb={2}
                    sx={{ borderBottom: '1px solid black' }}
                >
                    <Typography variant={'h1'}>
                        MattyChat-chat-chat
                    </Typography>
                </Box>

                <Grid container flex={1} gap={4}>
                    {/* side menu */}
                    <Stack
                        maxWidth={'14rem'}
                        width={'100%'}
                        gap={1}
                        pt={2}
                    >
                        <UserAction
                            user={user}
                            handleAuthAction={handleAuthAction}
                        />

                        {/* Room List */}
                        <RoomsList
                            db={firebaseDb}
                            activeRoom={activeRoom}
                            rooms={rooms}
                        />
                    </Stack>

                    <Divider
                        orientation={'vertical'}
                        flexItem
                        sx={{ borderColor: grey[400] }}
                    />

                    <Box display={'flex'} flex={1}>
                        {/* chat messages */}
                        <MessagesView
                            hasMoreMessages={hasMoreMessages}
                            isLoadingMessages={isLoadingMessages}
                            messages={messages}
                            room={activeRoom}
                            handleNewMessageSubmit={handleNewMessageSubmit}
                            loadMoreMessages={loadMoreMessages}
                        />
                    </Box>

                </Grid>

            </Grid>
        </Container>
    );
}
