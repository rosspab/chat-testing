import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { ChatRoom } from './components/ChatRoom';

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // Connect on component mount
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        function onConnect() {
            console.log('Connected');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log('Disconnected');
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="App" style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <h1>Chat en tiempo real</h1>
            <ConnectionState isConnected={ isConnected } />
            <ConnectionManager />
            {isConnected && <ChatRoom />}
        </div>
    );
}