document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startCaptureButton');
    const stopButton = document.getElementById('stopCaptureButton');
    const captureStatus = document.getElementById('captureStatus');
    const downloadContainer = document.getElementById('downloadCaptureContainer');
    const downloadButton = document.getElementById('downloadCaptureButton');

    startButton.addEventListener('click', function () {
        fetch('/config/pcap/start', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                captureStatus.style.display = 'block';
                captureStatus.textContent = data.message;
                captureStatus.className = 'alert alert-info';
                if (data.status === 'success') {
                    startButton.disabled = true;
                    stopButton.disabled = false;
                }
                if (data.status === 'error') {
                    captureStatus.className = 'alert alert-danger';
                }
            })
            .catch(() => {
                captureStatus.classList.replace('alert-info', 'alert-danger');
                captureStatus.style.display = 'block';
                captureStatus.textContent = 'Failed to start capture.';
            });
    });

    stopButton.addEventListener('click', function () {
        fetch('/config/pcap/stop', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                captureStatus.style.display = 'block';
                captureStatus.textContent = data.message;
                captureStatus.className = 'alert alert-info';
                if (data.status === 'success') {
                    startButton.disabled = false;
                    stopButton.disabled = true;
                    downloadContainer.style.display = 'block';
                }
                if (data.status === 'error') {
                    captureStatus.className = 'alert alert-danger';
                }
            })
            .catch(() => {
                captureStatus.style.display = 'block';
                captureStatus.textContent = data.message;
                captureStatus.className = 'alert alert-danger';
            });
    });

    downloadButton.addEventListener('click', function () {
        window.location.href = '/config/pcap/download';
    });
});
