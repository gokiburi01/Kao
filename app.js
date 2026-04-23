const video = document.getElementById("video");

// カメラ起動
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 }
  });
  video.srcObject = stream;
}

// モデル読み込み（確実に動くCDN）
async function loadModels() {
  const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
}

// メイン処理
async function init() {
  await loadModels();
  await startCamera();
}

init();

// 再生されたら処理開始
video.addEventListener("playing", () => {

  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  const ctx = canvas.getContext("2d");

  setInterval(async () => {

    // サイズ同期（これ超重要）
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );

    const resized = faceapi.resizeResults(detections, {
      width: canvas.width,
      height: canvas.height
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 緑の枠
    resized.forEach(det => {
      const { x, y, width, height } = det.box;

      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    });

  }, 100);
});
