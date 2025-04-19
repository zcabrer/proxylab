document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('log-container');
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const ws = new WebSocket(`${protocol}${window.location.host}/admincenter/log/stream`);

    ws.onmessage = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            const logEntry = document.createElement('div');
            logEntry.textContent = reader.result; // Convert Blob to text and display it
            logContainer.appendChild(logEntry);

            // Auto-scroll to the bottom
            logContainer.scrollTop = logContainer.scrollHeight;
        };
        reader.readAsText(event.data); // Read the Blob as text
    };

    ws.onclose = () => {
        const message = document.createElement('div');
        message.textContent = 'Connection closed.';
        logContainer.appendChild(message);
    };
});
