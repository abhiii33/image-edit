import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as fabric from "fabric";

const EditorPage = () => {
  const { imageUrl } = useParams();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // Initialize fabric canvas only once
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
    });

    setCanvas(fabricCanvas);
    return () => fabricCanvas.dispose(); // Cleanup on unmount
  }, []); // Runs only once

  // Load image using fabric.FabricImage
  useEffect(() => {
    if (!canvas || !imageUrl) return;

    const decodedUrl = decodeURIComponent(imageUrl);
    console.log("Loading image from:", decodedUrl);

    fabric.FabricImage.fromURL(decodedUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        if (!img) {
          console.error("Image failed to load.");
          return;
        }

        img.scaleToWidth(600);
        canvas.clear();
        canvas.add(img);
        canvas.centerObject(img);
        canvas.sendToBack(img);
        canvas.renderAll();
      })
      .catch((err) => console.error("Error loading image:", err));

  }, [canvas, imageUrl]); // Runs when canvas and imageUrl change

  // Function to add text to the canvas
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Your Caption", {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: "white",
      backgroundColor: "black",
      padding: 5,
    });
    canvas.add(text);
    canvas.renderAll();
  };

  // Function to add a shape
  const addShape = (shape) => {
    if (!canvas) return;
    let shapeObj;

    switch (shape) {
      case "circle":
        shapeObj = new fabric.Circle({
          radius: 40,
          fill: "red",
          left: 60,
          top: 80,
        });
        break;
      case "rectangle":
        shapeObj = new fabric.Rect({
          width: 80,
          height: 50,
          fill: "green",
          left: 50,
          top: 50,
        });
        break;
      case "triangle":
        shapeObj = new fabric.Triangle({
          width: 60,
          height: 60,
          fill: "blue",
          left: 50,
          top: 50,
        });
        break;
      default:
        return;
    }
    canvas.add(shapeObj);
    canvas.renderAll();
  };

  // Function to download the canvas as an image
  const downloadImage = () => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL({ format: "png", quality: 1 });
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Image</h1>

      {/* Canvas */}
      <canvas ref={canvasRef} className="border border-gray-400 shadow-md" />

      {/* Controls */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={addText}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Caption
        </button>
        <button
          onClick={() => addShape("circle")}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Add Circle
        </button>
        <button
          onClick={() => addShape("rectangle")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Rectangle
        </button>
        <button
          onClick={() => addShape("triangle")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Add Triangle
        </button>
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

export default EditorPage;
