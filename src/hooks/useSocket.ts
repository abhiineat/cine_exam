let socket: WebSocket | null = null;

export function getSocket(): WebSocket {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        try {
            socket = new WebSocket("ws://localhost:8080/v1/cine");

            socket.onopen = () => {
                console.log("🔌 WebSocket connected");
            };

            socket.onmessage = (event) => {
                console.log("📨 Message from server:", event.data);
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            socket.onclose = () => {
                console.warn("WebSocket closed");
            };
        } catch (error) {
            console.error("❌ Failed to initialize WebSocket:", error);
        }
    }

    return socket!;
}