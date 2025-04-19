// Upload button click event
document.getElementById('submitUploadButton').addEventListener('click', function () {
    const pfx = document.getElementById('pfx').files;
    const password = document.getElementById('password').value;
    const formData = new FormData();
    formData.append('pfx', pfx[0]);
    formData.append('password', password);

    fetch('/admincenter/tls/certificateupload', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then(data => {
        const responseDisplay = document.getElementById('uploadResponse');
        responseDisplay.style.display = 'block';
        responseDisplay.innerHTML = `${data.message}<br>`; // Display the server response
    })
    .catch(error => {
        console.error('Error:', error);
        const responseDisplay = document.getElementById('uploadResponse');
        responseDisplay.style.display = 'block';
        responseDisplay.textContent = `Error: ${error.message || error}`;
    });
});