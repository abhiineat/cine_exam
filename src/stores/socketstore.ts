import { create } from "zustand";

type SocketState = {
    socket: WebSocket | null;
    initSocket: () => Promise<void>;
    closeSocket: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,

    initSocket: async () => {
        const existingSocket = get().socket;

        if (existingSocket && existingSocket.readyState !== WebSocket.CLOSED) {
            console.log("⚠️ Socket already initialized.");
            return;
        }

        try {
            const response = await fetch("/api/fetch-token");
            if (!response.ok) throw new Error("Failed to fetch token");
            const { token } = await response.json();

            const ws = new WebSocket(
                `wss://apicine.rishirajsingh.in/app/cine?token=${token}`
            );

            ws.onopen = () => {
                console.log("🔌 WebSocket connected");
            };

            ws.onmessage = (event) => {
                console.log("📨 Message from server:", event.data);
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onclose = () => {
                console.warn("WebSocket closed");
            };

            set({ socket: ws });
        } catch (err) {
            console.error("❌ Failed to initialize WebSocket:", err);
        }
    },

    closeSocket: () => {
        const sock = get().socket;
        if (sock && sock.readyState === WebSocket.OPEN) {
            sock.close();
            console.log("🔒 WebSocket closed by client.");
        }
        set({ socket: null });
    },
}));