import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

export function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        function onChatMessage(msg) {
            console.log('Chat message received in component:', msg);
            setMessages(prev => [...prev, msg]);
        }

        console.log('Setting up chat message listener');
        socket.on('chat message', onChatMessage);
        
        return () => {
            console.log('Cleaning up chat message listener');
            socket.off('chat message', onChatMessage);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const message = inputValue.trim();
            console.log('Attempting to send message:', message);
            
            try {
                socket.emit('chat message', message, (response) => {
                    console.log('Message sent callback:', response);
                });
                setInputValue('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="chat-room">
            <div className="messages" style={{ 
                height: '300px', 
                overflowY: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        textAlign: msg.userId === socket.id ? 'right' : 'left',
                        margin: '5px',
                        padding: '5px'
                    }}>
                        <small style={{color: '#666'}}>{msg.userId.slice(0,4)}</small>
                        <div style={{
                            background: msg.userId === socket.id ? '#007bff' : '#e9ecef',
                            color: msg.userId === socket.id ? 'white' : 'black',
                            padding: '8px',
                            borderRadius: '10px',
                            display: 'inline-block',
                            maxWidth: '70%'
                        }}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{flex: 1, padding: '8px'}}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
