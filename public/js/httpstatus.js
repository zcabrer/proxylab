document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('httpstatus-form');
    const resultContainer = document.getElementById('result-container');
    const statusCodeInput = document.getElementById('status-code');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const statusCode = parseInt(statusCodeInput.value, 10);

        // Validate status code
        if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
            resultContainer.textContent = 'Invalid HTTP status code. Please enter a value between 100 and 599.';
            return;
        }

        const method = document.querySelector('input[name="method"]:checked').value; // Get selected method

        try {
            let response;
            if (method === 'POST') {
                response = await fetch('/tools/httpstatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ statusCode }),
                });
            } else if (method === 'GET') {
                response = await fetch(`/tools/httpstatus/generate?statusCode=${statusCode}`);
            }

            const text = await response.text();
            resultContainer.textContent = `Server responded with: ${response.status}`;
        } catch (error) {
            resultContainer.textContent = `Error: ${error.message}`;
        }
    });

    // Add input validation feedback
    statusCodeInput.addEventListener('input', () => {
        const statusCode = parseInt(statusCodeInput.value, 10);
        if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
            statusCodeInput.setCustomValidity('Please enter a valid HTTP status code (100–599).');
        } else {
            statusCodeInput.setCustomValidity('');
        }
    });
});
