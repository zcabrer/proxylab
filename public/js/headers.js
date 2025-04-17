document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const responseContainer = document.getElementById('responseHeaderFieldsContainer');
    const requestContainer = document.getElementById('requestHeaderFieldsContainer');
    responseContainer.innerHTML = ''; // Clear any existing content
    requestContainer.innerHTML = ''; // Clear any existing content

    if (urlParams.toString() === '') {
        // No query parameters, add a default empty row for response headers
        const newResponseRow = createHeaderRow();
        responseContainer.appendChild(newResponseRow);

        // No query parameters, add a default empty row for request headers
        const newRequestRow = createHeaderRow();
        requestContainer.appendChild(newRequestRow);
    } else {
        // Populate fields from query parameters for response headers
        urlParams.forEach((value, key) => {
            if (key.startsWith('response_')) {
                const headerName = key.replace('response_', '');
                const newRow = createHeaderRow();
                newRow.querySelector('input[placeholder="header name"]').value = headerName;
                newRow.querySelector('input[placeholder="header value"]').value = value;
                responseContainer.appendChild(newRow);
            } else if (key.startsWith('request_')) {
                const headerName = key.replace('request_', '');
                const newRow = createHeaderRow();
                newRow.querySelector('input[placeholder="header name"]').value = headerName;
                newRow.querySelector('input[placeholder="header value"]').value = value;
                requestContainer.appendChild(newRow);
            }
        });
    }

    // Add delete functionality to both containers
    addDeleteRowFunctionality(responseContainer);
    addDeleteRowFunctionality(requestContainer);
});

function createHeaderRow() {
    const newRow = document.createElement('div');
    newRow.className = 'row mt-2 align-items-center';
    newRow.innerHTML = `
        <div class="col">
            <input type="text" class="form-control" placeholder="header name" aria-label="header name">
        </div>
        <div class="col">
            <input type="text" class="form-control" placeholder="header value" aria-label="header value">
        </div>
        <div class="col-auto">
            <button type="button" class="btn btn-secondary btn-sm delete-row-button">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    return newRow;
}

function addDeleteRowFunctionality(container) {
    container.addEventListener('click', function (event) {
        if (event.target.closest('.delete-row-button')) {
            const row = event.target.closest('.row');
            row.remove();
        }
    });
}

document.getElementById('addResponseHeaderButton').addEventListener('click', function () {
    const container = document.getElementById('responseHeaderFieldsContainer');
    const newRow = createHeaderRow();
    container.appendChild(newRow);
});

document.getElementById('addRequestHeaderButton').addEventListener('click', function () {
    const container = document.getElementById('requestHeaderFieldsContainer');
    const newRow = createHeaderRow();
    container.appendChild(newRow);
});

document.getElementById('submitHeadersButton').addEventListener('click', function () {
    const responseContainer = document.getElementById('responseHeaderFieldsContainer');
    const requestContainer = document.getElementById('requestHeaderFieldsContainer');
    const responseRows = responseContainer.getElementsByClassName('row');
    const requestRows = requestContainer.getElementsByClassName('row');
    let queryParams = [];

    // Collect response headers
    for (let row of responseRows) {
        const headerName = row.querySelector('input[placeholder="header name"]').value;
        const headerValue = row.querySelector('input[placeholder="header value"]').value;
        if (headerName && headerValue) {
            queryParams.push(`response_${encodeURIComponent(headerName)}=${encodeURIComponent(headerValue)}`);
        }
    }

    // Collect request headers
    for (let row of requestRows) {
        const headerName = row.querySelector('input[placeholder="header name"]').value;
        const headerValue = row.querySelector('input[placeholder="header value"]').value;
        if (headerName && headerValue) {
            queryParams.push(`request_${encodeURIComponent(headerName)}=${encodeURIComponent(headerValue)}`);
        }
    }

    const queryString = queryParams.join('&');
    const url = `/tools/headers?${queryString}`;
    window.location.href = url; // Redirect to the new URL
});