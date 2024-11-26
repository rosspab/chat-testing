import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = io(URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
});

socket.on('chat message', (msg) => {
    console.log('Chat message received:', msg);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.onAny((eventName, ...args) => {
    console.log('Socket event:', eventName, args);
});