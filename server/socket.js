const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        socket.on("chatMessage", ({ roomId, message, username }) => {
        io.to(roomId).emit("message", {
            message,
            sender: username,
            timestamp: new Date()
        });
        });

        socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;
