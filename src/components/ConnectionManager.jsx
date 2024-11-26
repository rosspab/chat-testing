import React from 'react';
import { socket } from '../socket';

export function ConnectionManager() {
    function connect() {
        console.log('Connect button clicked');
        socket.connect();
    }

    function disconnect() {
        console.log('Disconnect button clicked');
        socket.disconnect();
    }

    return (
        <>
            <button onClick={ connect }>Connect</button>
            <button onClick={ disconnect }>Disconnect</button>
        </>
    );
}