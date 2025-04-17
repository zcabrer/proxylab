document.getElementById('fileInput').addEventListener('change', function (event) {
    // Validate file input
    const files = event.target.files;
    let totalSize = 0;

    if (files.length > 5) {
        alert('You can only upload up to 5 files.');
        event.target.value = ''; // Clear the input
    } else {
        for (let i = 0; i < files.length; i++) {
            totalSize += files[i].size;
            if (totalSize > 1.5 * 1024 * 1024 * 1024) {
                alert('The combined size of all files should not exceed 1.5GB.');
                event.target.value = ''; // Clear the input
                break;
            }
        }
    }

    // Update file list display
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear previous file list
    for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const listItem = document.createElement('div');
        if (file.size < 1000 * 1024) {
            listItem.textContent = `${file.name} (${file.size} Bytes)`;
        } else {
            listItem.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
        }
        fileList.appendChild(listItem);
    }
});

document.getElementById('submitUploadButton').addEventListener('click', function () {
    const files = document.getElementById('fileInput').files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const startTime = Date.now();

    fetch('/tools/files', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then(data => {
        const responseDisplay = document.getElementById('uploadResponse');
        responseDisplay.style.display = 'block';
        // responseDisplay.textContent = `Server Response: ${JSON.stringify(data, null, 2)}`;
        responseDisplay.innerHTML = `Server Response: ${data.message}<br>
        File Size (Bytes): ${data.fileSizeB}<br>
        File Size (KiloBytes): ${data.fileSizeKB}<br>
        File Size (MegaBytes): ${data.fileSizeMB}`; // Display the server response

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const uploadDurationText = document.getElementById('uploadDurationText');
        uploadDurationText.textContent = `Upload complete! It took ${duration} seconds.`;
    })
    .catch(error => {
        console.error('Error:', error);
        const responseDisplay = document.getElementById('uploadResponse');
        responseDisplay.style.display = 'block';
        responseDisplay.textContent = `Error: ${error}`;
    });
});

// Add event listener for download button
document.getElementById('downloadButton').addEventListener('click', function () {
    const fileSizePicker = document.getElementById('fileSizePicker').value;
    const downloadUrl = `files/downloads/${fileSizePicker}`;

    const progressText = document.getElementById('downloadProgressText');
    progressText.textContent = "Downloading... please wait."; // Show progress message

    const startTime = Date.now();

    fetch(downloadUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const downloadLink = document.createElement('a');
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = `${fileSizePicker}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            progressText.textContent = `Download complete! It took ${duration} seconds.`; // Update progress message
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while downloading the file.');
            progressText.textContent = ''; // Clear progress message on error
        });
});
