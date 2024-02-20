import React, { useState, useRef } from "react";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { Loader } from "../../components"
import { detectImage } from "../../utils/detect";
import { download } from "../../utils/download";

import "./Tug.css";


const Tug = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({ text: "Loading OpenCV.js", progress: null });
  const [image, setImage] = useState(null);
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  let streaming = null;
  let processVideoInterval;
  
  const onClickVideoStream = () => {
    let video = document.getElementById("vid");
    let canvas = document.getElementById("canvas");
    let time_element = document.getElementById("time");
    let button_webcam_element = document.getElementById("btn-webcam");
    
    if (streaming == null) {
      streaming = "camera";
    
      video.style.display = "block";
      canvas.style.display = "block";

      video.width = 640;
      video.height = 640;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();

          let src = new cv.Mat(640, 640, cv.CV_8UC4);
          let cap = new cv.VideoCapture(video);

          async function processVideo() {
            try {
              if (!streaming) {
                // clean and stop.
                src.delete();
                return;
              }
              video.style.display = "block";
              let start = Date.now();
              cap.read(src);
              detectImage(src, canvas, session, topk, iouThreshold, scoreThreshold, modelInputShape, true);
              let end = Date.now();
              let time = end - start;
              time_element.innerHTML = "Time: " + time + "ms";

            } catch (err) {
              alert(err);
            }
          }

          processVideoInterval = setInterval(processVideo, 10);
        })
        .catch(function (err) {
          console.log("An error occurred! " + err);
        });
    }
    else {
      streaming = null;
      // close webcam
      video.style.display = "none";
      clearInterval(processVideoInterval);
      video.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
      // clean time
      time_element.innerHTML = "Time: 0ms";
    }

    button_webcam_element.innerHTML = (streaming === "camera" ? "Close" : "Open") + " Webcam";

  };

  const onClickInputVideoStream = () => {
    let video = document.getElementById("vid");
    let canvas = document.getElementById("canvas");
    let time_element = document.getElementById("time");
    let button_webcam_element = document.getElementById("btn-webcam");
    let fileInput = document.getElementById("fileInput"); // Reference to the file input element
    
    if (streaming == null) {
      fileInput.click(); // Trigger click event on file input element
    }
  
    // Function to handle file selection
    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0]; // Get the selected file
      const blobUrl = URL.createObjectURL(file); // Create a blob URL for the selected file
  
      if (streaming == null) {
        streaming = "file"; // Indicate that we're using a file instead of a camera stream
  
        video.style.display = "block";
        canvas.style.display = "block";
  
        video.width = 640;
        video.height = 640;
  
        // Set the src attribute of the video element to the blob URL of the selected file
        video.src = blobUrl;
        video.play();
  
        let src = new cv.Mat(640, 640, cv.CV_8UC4); // Assuming a fixed size for the video frame
        let cap = new cv.VideoCapture(video);
  
        async function processVideo() {
          try {
            if (!streaming) {
              // clean and stop.
              src.delete();
              return;
            }
            video.style.display = "block";
            let start = Date.now();
            cap.read(src);
            detectImage(src, canvas, session, topk, iouThreshold, scoreThreshold, modelInputShape, true);
            let end = Date.now();
            let time = end - start;
            time_element.innerHTML = "Time: " + time + "ms";
          } catch (err) {
            alert(err);
          }
        }
  
        processVideoInterval = setInterval(processVideo, 10);
  
        // Change button text to "Close Video"
        button_webcam_element.innerHTML = "Close Video";
      } else {
        streaming = null;
        // close video
        video.style.display = "none";
        canvas.style.display = "none"; // Hide the canvas element
        canvas.width = 0; // Reset canvas width
        canvas.height = 0; // Reset canvas height
        clearInterval(processVideoInterval);
        video.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
        // clean time
        time_element.innerHTML = "Time: 0ms";
  
        // Change button text back to "Open Video"
        button_webcam_element.innerHTML = "Open Video";
  
        // Reset file input value to clear previous selection
        fileInput.value = "";
      }
    });
  
    // Close video stream when the "Close Video" button is clicked
    button_webcam_element.addEventListener("click", function () {
      if (streaming === "file") {
        streaming = null;
        // close video
        video.style.display = "none";
        canvas.style.display = "none"; // Hide the canvas element
        canvas.width = 0; // Reset canvas width
        canvas.height = 0; // Reset canvas height
        clearInterval(processVideoInterval);
        video.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
        // clean time
        time_element.innerHTML = "Time: 0ms";
  
        // Change button text back to "Open Video"
        button_webcam_element.innerHTML = "Open Video";
      }
    });
  };
  
  
  
  
  
  // Configs
  const modelName = "yolov8n-pose.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk = 50;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.25;

  // wait until opencv.js initialized
  cv["onRuntimeInitialized"] = async () => {
    const baseModelURL = `${process.env.PUBLIC_URL}/model`;

    // create session
    const arrBufNet = await download(
      `${baseModelURL}/${modelName}`, // url
      ["Loading YOLOv8 Pose model", setLoading] // logger
    );

    let yolov8 = await InferenceSession.create(arrBufNet);

    const arrBufNMS = await download(
      `${baseModelURL}/modified-nms-yolov8-pose.onnx`, // url
      ["Loading NMS model", setLoading] // logger
    );
    const nms = await InferenceSession.create(arrBufNMS);

    // warmup main model
    setLoading({ text: "Warming up model...", progress: null });
    const tensor = new Tensor(
      "float32",
      new Float32Array(modelInputShape.reduce((a, b) => a * b)),
      modelInputShape
    );

    await yolov8.run({ images: tensor });

    setSession({ net: yolov8, nms: nms });
    setLoading(null);
  };
  return (
    <div id="tug" className="Tug">
      {/* Loader */}
      {loading && (
        <Loader>
          {loading.progress ? `${loading.text} - ${loading.progress}%` : loading.text}
        </Loader>
      )}
  
      {/* Header */}
      <div className="header">
        <h1>YOLOv8 Pose Detection App</h1>
        <h4 id="time">0</h4>
        <p>
          YOLOv8 pose detection application live on browser powered by{" "}
          <code>onnxruntime-web</code>
        </p>
        <p>
          Serving : <code className="code">{modelName}</code>
        </p>
      </div>
  
      {/* Content */}
      <div className="content">
        {/* Image */}
        <img
          ref={imageRef}
          src="#"
          alt=""
          style={{ display: image ? "block" : "none" }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            );
          }}
        />
  
        {/* Video */}
        <video id="vid" ref={videoRef} autoPlay playsInline muted style={{ inlineSize: "fit-content" }} />
  
        {/* Canvas */}
        <canvas
        id="canvas"
        width={videoRef.current?.videoWidth || 640}
        height={videoRef.current?.videoHeight || 640}
        ref={canvasRef}
      />
      </div>
  
      {/* Input for image */}
      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // handle next image to detect
          if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
          }
  
          const url = URL.createObjectURL(e.target.files[0]); // create image url
          imageRef.current.src = url; // set image source
          setImage(url);
        }}
      />
  
      {/* Input for video */}
      <input
        type="file"
        id="fileInput" // Make sure to set the correct id
        accept="video/mp4" // Accept only MP4 video files
        style={{ display: "none" }}
        onChange={(e) => {
          // handle selected video file
          const url = URL.createObjectURL(e.target.files[0]); // create video url
          videoRef.current.src = url; // set video source
          videoRef.current.play(); // play video
        }}
      />
  
      {/* Buttons */}
      <div className="btn-container">
        {/* Button to open local image */}
        <button
          onClick={() => {
            inputImage.current.click();
          }}
        >
          Open local image
        </button>
  
        {/* Button to toggle webcam */}
        <button id="btn-webcam" onClick={onClickInputVideoStream}>
          Open Video
        </button>
  
        {/* Button to close image (if open) */}
        {image && (
          <button
            onClick={() => {
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
              //clear canvas
              const ctx = canvasRef.current.getContext("2d");
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }}
          >
            Close image
          </button>
        )}
  
        {/* Button to toggle webcam */}
        <button id="btn-webcam" onClick={onClickVideoStream}>
          Open Webcam
        </button>
      </div>
    </div>
  );
};  
export default Tug;