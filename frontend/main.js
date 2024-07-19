import { io } from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000");
  const startBtn = document.getElementById("startBtn");
  const screenVideo = document.getElementById("screen");

  startBtn.addEventListener("click", async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    screenVideo.srcObject = mediaStream;

    const mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      socket.emit("screen-data", event.data);
    };
    mediaRecorder.start(100);
  });

  socket.on("screen-data", (data) => {
    const blob = new Blob([data], { type: "video/webm" });
    screenVideo.src = URL.createObjectURL(blob);
  });
});
