const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");

const BACKEND_URL = "https://stardist-api.onrender.com/predict";
// const BACKEND_URL = "http://127.0.0.1:8000/predict";

uploadBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.innerText = "Processing...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Server error: " + response.status);

    // ✅ Parse JSON (backend returns both masks)
    const data = await response.json();

    // data.stardist_mask and data.unet_mask are base64 strings
    resultDiv.innerHTML = `
      <div style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap;">
        <div>
          <h3>Original Image</h3>
          <img src="${URL.createObjectURL(file)}" alt="Original" width="300"/>
        </div>
        <div>
          <h3>StarDist Output</h3>
          <img src="${data.stardist_mask}" alt="StarDist" width="300"/>
        </div>
        <div>
          <h3>U-Net Output</h3>
          <img src="${data.unet_mask}" alt="UNet" width="300"/>
        </div>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.innerText = "Upload & Predict";
  }
});
