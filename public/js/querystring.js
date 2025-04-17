// Submit query string
document.getElementById('submitRawQueryButton').addEventListener('click', function () {
    const rawQueryInput = document.getElementById('rawQueryInput').value;

    // Store the raw query input in localStorage to persist it after redirection
    localStorage.setItem('rawQueryInput', rawQueryInput);

    // Redirect to the submit endpoint with the raw query string
    window.location.href = `/tools/querystring?${rawQueryInput}`;
});

// Restore the raw query input from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    const rawQueryInput = localStorage.getItem('rawQueryInput');
    if (rawQueryInput) {
        document.getElementById('rawQueryInput').value = rawQueryInput;
        localStorage.removeItem('rawQueryInput'); // Clear it after restoring
    }
});