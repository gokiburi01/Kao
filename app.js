const video = document.getElementById("video");

// カメラ起動
navigator.mediaDevices.getUserMedia({ video: {} })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => console.error(err));

// モデル読み込み
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/weights')
]).then(startVideo);

// 検出処理
function startVideo() {
  video.addEventListener("play", () => {

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {
      width: video.width,
      height: video.height
    };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      const resized = faceapi.resizeResults(detections, displaySize);

      // 画面クリア
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      // 緑の四角形で囲む
      resized.forEach(det => {
        const box = det.box;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "lime"; // 緑
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();
      });

    }, 100);
  });
}
