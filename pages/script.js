let model, webcam, maxPredictions;

// Load the Teachable Machine model
async function loadModel() {
    const modelURL = "/model.json";  // Model file inside public/
    const metadataURL = "/metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    startWebcam();
}

// Start webcam feed
async function startWebcam() {
    webcam = new tmImage.Webcam(300, 300, true); // Width, Height, Flip
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam").srcObject = webcam.canvas.captureStream();
    classifyFrame();
}

// Run classification on each frame
async function classifyFrame() {
    const prediction = await model.predict(webcam.canvas);
    let maxClass = "";
    let maxProbability = 0;

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > maxProbability) {
            maxProbability = prediction[i].probability;
            maxClass = prediction[i].className;
        }
    }

    document.getElementById("result").innerText = 'Category:${maxClass}';
    requestAnimationFrame(classifyFrame); // Keep scanning
}

loadModel();