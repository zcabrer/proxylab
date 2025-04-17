document.getElementById('submitTimeoutButton').addEventListener('click', function() {
    const timeoutInput = document.getElementById('timeoutInput').value;
    const timeoutResponse = document.getElementById('timeoutResponse');
    const timeoutImage = document.getElementById('timeoutImage');
    const timerDisplay = document.getElementById('timerDisplay');
    let timer = 0;
    let timerInterval;

    if (timeoutInput < 1 || timeoutInput > 86400) {
        timeoutResponse.style.display = 'block';
        timeoutResponse.textContent = 'Please enter a value between 1 and 86,400 seconds.';
        timeoutImage.style.display = 'none';
        return;
    }

    // Hide the image if it is currently displayed
    timeoutImage.style.display = 'none';

    // Start the timer
    timerDisplay.style.display = 'inline';
    timerDisplay.textContent = `Time elapsed: ${timer} seconds`;
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time elapsed: ${timer} seconds`;
    }, 1000);

    fetch(`/tools/timeout/submit?seconds=${timeoutInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            clearInterval(timerInterval); // Stop the timer
            const imageUrl = URL.createObjectURL(blob);
            timeoutImage.src = imageUrl;
            timeoutImage.style.display = 'block';
            timeoutImage.style.width = '300px'; // Set the width to 300px
            timeoutImage.style.height = 'auto'; // Maintain aspect ratio
            timeoutResponse.style.display = 'none';
        })
        .catch(error => {
            clearInterval(timerInterval); // Stop the timer
            timeoutResponse.style.display = 'block';
            timeoutResponse.textContent = 'An error occurred: ' + error.message;
            timeoutImage.style.display = 'none';
        });
});
