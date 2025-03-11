import WebSocket, { WebSocketServer } from "ws";
import { createServer } from 'http';

const server = createServer();
const wss = new WebSocketServer({ server });

// Map to store groups of WebSocket connections
// Key: groupId, Value: Set of WebSocket clients
const groups = new Map();

wss.on('connection', (ws, req) => {
    // Parse cookies to get userId and groupId
    const cookies = req.headers.cookie;
    if (!cookies) {
        ws.close(1008, 'Cookies are required');
        return;
    }

    const cookieArray = cookies.split(';').map(cookie => cookie.trim());
    const userIdCookie = cookieArray.find(cookie => cookie.startsWith('userId='));
    const groupIdCookie = cookieArray.find(cookie => cookie.startsWith('groupId='));

    const userId = userIdCookie ? userIdCookie.split('=')[1] : null;
    const groupId = groupIdCookie ? groupIdCookie.split('=')[1] : null;

    // Validation
    if (!userId || !groupId) {
        ws.close(1008, 'Both userId and groupId are required');
        return;
    }

    // Initialize group if it doesn't exist
    if (!groups.has(groupId)) {
        groups.set(groupId, new Set());
    }

    // Add client to their group and store user info
    const clientGroup = groups.get(groupId);
    ws.userId = userId;
    ws.groupId = groupId;
    clientGroup.add(ws);

    console.log(`User ${userId} joined group ${groupId}`);
    console.log(`Group ${groupId} now has ${clientGroup.size} members`);

    // Send welcome message
    ws.send(`Hello ${userId}, welcome to group ${groupId}!`);

    // Handle incoming messages
    ws.on('message', (data) => {
        const message = data.toString();
        const clientGroup = groups.get(ws.groupId);
        
        // Broadcast message to all group members except sender
        clientGroup.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`${ws.userId}: ${message}`);
            }
        });
    });

    // Clean up when client disconnects
    ws.on('close', () => {
        const clientGroup = groups.get(ws.groupId);
        clientGroup.delete(ws);
        
        // Remove group if empty
        if (clientGroup.size === 0) {
            groups.delete(ws.groupId);
        }
        
        console.log(`User ${ws.userId} left group ${ws.groupId}`);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error for user ${ws.userId}:`, error);
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});