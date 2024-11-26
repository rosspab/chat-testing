const { Server } = require('socket.io');
const http = require('http');

// Crear servidor HTTP
const httpServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Socket.IO server running');
});

// Crear instancia de Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Manejar conexiones
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Log all incoming events for debugging
    socket.onAny((eventName, ...args) => {
        console.log('Evento recibido:', eventName, args);
    });

    socket.on('chat message', (msg) => {
        console.log('Mensaje recibido de', socket.id + ':', msg);
        
        const messageData = {
            userId: socket.id,
            message: msg,
            timestamp: new Date().toISOString()
        };
        
        // Broadcast to all clients
        io.emit('chat message', messageData);
    });

    // ...rest of the connection handlers...
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    socket.on('create-something', (value) => {
        console.log('create-something:', value);
        socket.emit('foo', value);
    });
});

// Manejo de errores
httpServer.on('error', (err) => {
    console.error('Error del servidor:', err);
});

// Prevenir que el proceso termine por errores no manejados
process.on('uncaughtException', (err) => {
    console.error('Error no manejado:', err);
});

process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');
    httpServer.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

// Iniciar servidor
const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Servidor Socket.IO ejecutándose en http://localhost:${PORT}`);
    console.log('Presiona Ctrl+C para detener');
});
