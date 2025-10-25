const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const resultDiv = document.getElementById("result");

const BACKEND_URL = "https://stardist-api.onrender.com/predict";
// const BACKEND_URL = "http://127.0.0.1:8000/predict";

// 👆 Replace with your actual Render backend URL

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

    // Expecting the backend to return the image (mask) as bytes
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <h3>Original Image:</h3>
      <img id="preview" src="${URL.createObjectURL(file)}" alt="Original" />
      <h3>Segmented Output:</h3>
      <img id="output" src="${imageUrl}" alt="Result" />
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.innerText = "Upload & Predict";
  }
});
