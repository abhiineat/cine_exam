let socket: WebSocket | null = null;

export async function fetchToken(): Promise<string | null> {
    try {
        const response = await fetch("/api/fetch-token");
        if (!response.ok) {
            throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

export async function getSocket(): Promise<WebSocket> {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        try {
            const token = await fetchToken();
            if (!token) throw new Error("Missing token");

            socket = new WebSocket(`ws://localhost:8080/cine?token=${token}`);

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
            throw error;
        }
    }

    return socket;
}
