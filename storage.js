const API_BASE_URL = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", () => {

    const reportsCard = document.getElementById("reportsCard");
    const storageModal = document.getElementById("storageModal");
    const closeStorageModal = document.getElementById("closeStorageModal");
    const storageFileList = document.getElementById("storageFileList");
    const storageFileInput = document.getElementById("storageFileInput");
    const storageUploadButton = document.getElementById("storageUploadButton");

    if (!reportsCard) {
        return;
    }

    reportsCard.addEventListener("click", async () => {

        storageModal.classList.add("active");

        await loadFiles();

    });

    closeStorageModal.addEventListener("click", () => {
        storageModal.classList.remove("active");
    });

    storageModal.addEventListener("click", (event) => {

        if (event.target === storageModal) {
            storageModal.classList.remove("active");
        }

    });

    storageUploadButton.addEventListener("click", async () => {

        const file = storageFileInput.files[0];

        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("subsystem", "braking");
        formData.append("category", "reports");

        storageUploadButton.disabled = true;
        storageUploadButton.textContent = "Uploading...";

        try {

            const response = await fetch(
                `${API_BASE_URL}/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            alert("File uploaded successfully!");

            storageFileInput.value = "";

            await loadFiles();

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            storageUploadButton.disabled = false;
            storageUploadButton.textContent = "Upload File";

        }

    });

    async function loadFiles() {

        storageFileList.innerHTML = "<p>Loading files...</p>";

        try {

            const response = await fetch(
                `${API_BASE_URL}/files/braking/reports`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load files");
            }

            if (data.files.length === 0) {

                storageFileList.innerHTML =
                    "<p>No files uploaded yet.</p>";

                return;
            }

            storageFileList.innerHTML = "";

            data.files.forEach(file => {

                const fileRow = document.createElement("div");

                fileRow.className = "storage-file-row";

                fileRow.innerHTML = `
                    <span class="storage-file-name">
                        ${file.filename}
                    </span>

                    <span class="storage-file-size">
                        ${formatFileSize(file.size)}
                    </span>

                    <button class="storage-download-button">
                        Download
                    </button>

                    <button class="storage-delete-button">
                        Delete
                    </button>
                `;


                const downloadButton =
                    fileRow.querySelector(".storage-download-button");

                const deleteButton =
                    fileRow.querySelector(".storage-delete-button");

                downloadButton.addEventListener("click", async () => {

                    try {

                        const response = await fetch(
                            `${API_BASE_URL}/download/braking/reports/${encodeURIComponent(file.filename)}`
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data.error || "Download failed");
                        }

                        window.open(data.download_url, "_blank");

                    } catch (error) {

                        console.error(error);

                        alert(error.message);

                    }

                });


                deleteButton.addEventListener("click", async () => {

                    const confirmed = confirm(
                        `Are you sure you want to delete "${file.filename}"?`
                    );

                    if (!confirmed) {
                        return;
                    }

                    try {

                        const response = await fetch(
                            `${API_BASE_URL}/files/braking/reports/${encodeURIComponent(file.filename)}`,
                            {
                                method: "DELETE"
                            }
                        );

                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data.error || "Delete failed");
                        }

                        await loadFiles();

                    } catch (error) {

                        console.error(error);

                        alert(error.message);

                    }

                });

                storageFileList.appendChild(fileRow);

            });

        } catch (error) {

            console.error(error);

            storageFileList.innerHTML =
                "<p>Could not load files.</p>";

        }

    }

});

function formatFileSize(bytes) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}