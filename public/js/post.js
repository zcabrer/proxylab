document
    .getElementById("submitBodyButton")
    .addEventListener("click", function () {
        const contentTypeSelect =
            document.getElementById("contentTypeSelect");
        const selectedContentType =
            contentTypeSelect.value === "other"
                ? document.getElementById("customTypeInput").value
                : contentTypeSelect.value;
        const bodyContent =
            document.getElementById("bodyContent").value;
        const boundary = document.getElementById("boundary").value;

        // Calculate and display content length
        const contentLength = new Blob([bodyContent]).size;
        const contentLengthDisplay = document.getElementById(
            "contentLengthDisplay"
        );
        const contentLengthElement =
            document.getElementById("contentLength");
        contentLengthElement.textContent = contentLength + " bytes";
        contentLengthDisplay.style.display = "block";

        // Add content-type header
        const headers = {
            "Content-Type": selectedContentType,
        };

        if (selectedContentType === "multipart/form-data") {
            const formData = new FormData();
            formData.append("file", bodyContent);

            // Manually construct the multipart/form-data body
            const boundary = document.getElementById("boundary").value || "----WebKitFormBoundary7MA4YWxkTrZu0gW";
            const body = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="file.txt"\r\nContent-Type: text/plain\r\n\r\n${bodyContent}\r\n--${boundary}--`;

            fetch("/tools/post", {
                method: "POST",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${boundary}`
                },
                body: body,
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                const responseDisplay =
                    document.getElementById("responseDisplay");
                const responseContent =
                    document.getElementById("responseContent");
                responseContent.textContent = JSON.stringify(data, null, 2);
                responseContent.textContent += `\n\n multipart/form-data request body:\n\n${body}`;
                responseDisplay.style.display = "block";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error: " + error);
            });
        } else {
            fetch("/tools/post", {
                method: "POST",
                headers: headers,
                body: bodyContent,
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data);
                    const responseDisplay =
                        document.getElementById("responseDisplay");
                    const responseContent =
                        document.getElementById("responseContent");
                    responseContent.textContent = JSON.stringify(data, null, 2);
                    responseDisplay.style.display = "block";
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error: " + error);
                });
        }
    });

document
    .querySelector(".form-select")
    .addEventListener("change", function () {
        const placeholderMap = {
            "application/json": '{\n  "key": "value",\n  "id": 1,\n  "name": "John Doe",\n  "age": 29\n}',
            "application/xml": "<root>\n  <key>value</key>\n  <id>1</id>\n  <name>John Doe</name>\n  <age>29</age>\n</root>",
            "application/x-www-form-urlencoded": "key=value&id=1&name=John+Doe&age=29",
            "application/xhtml+xml":
                '<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml">\n  <head>\n    <title>Title</title>\n  </head>\n  <body>\n    <p>Content</p>\n  </body>\n</html>',
            "text/plain": "This is a plain text message.",
            "text/csv": "id,name,age\n1,John Doe,29\n2,Jane Smith,34",
            "text/javascript": 'console.log("Hello, world!");',
            "text/html":
                "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Title</title>\n  </head>\n  <body>\n    <p>Content</p>\n  </body>\n</html>",
            "text/css": "body {\n  font-family: Arial, sans-serif;\n}",
            other: "Enter body content here",
        };
        const selectedType = this.value;
        const exampleContent = document.getElementById("exampleContent");
        const customContentTypeDiv = document.getElementById("customContentType");
        const boundaryInput = document.getElementById("boundaryInput");
        const exampleGuidance = document.getElementById("exampleGuidance");
        if (selectedType === "other") {
            customContentTypeDiv.style.display = "block";
        } else {
            customContentTypeDiv.style.display = "none";
        }
        if (selectedType === "multipart/form-data") {
            boundaryInput.style.display = "block";
            exampleGuidance.style.display = "block";
            exampleGuidance.textContent = "Multipart/form-data is a content type used in HTTP requests to send different types of data in a single request. It's often used when submitting forms that include files, but it can also handle regular text fields. When a request is made with multipart/form-data, the data is divided into multiple parts, separated by a unique boundary string. The boundary ensures that the receiver can correctly identify where one part ends and the next begins. Specify a boundary to use and then enter the text to upload as the form-data content. This tool only supports the text/plain file type for mutlipart/form-data.";
        } else {
            boundaryInput.style.display = "none";
            exampleGuidance.style.display = "none";
        }
        exampleContent.textContent = placeholderMap[selectedType]
        exampleContent.style.display = exampleContent.textContent === "" ? "none" : "block";
        exampleHeader.style.display = exampleContent.textContent === "" ? "none" : "block";
    });