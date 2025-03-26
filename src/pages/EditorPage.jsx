import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as fabric from "fabric";

const EditorPage = () => {
  const { imageUrl } = useParams();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;


    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
    });

    setCanvas(fabricCanvas);

    
    const decodedUrl = decodeURIComponent(imageUrl);
    console.log("Loading image from:", decodedUrl);

    fabric.Image.fromURL(
      decodedUrl,
      (img) => {
        if (!img) {
          console.error("Image failed to load.");
          return;
        }

        img.scaleToWidth(fabricCanvas.width);
        if (img.getScaledHeight() > fabricCanvas.height) {
          img.scaleToHeight(fabricCanvas.height);
        }

        fabricCanvas.clear(); 
        fabricCanvas.add(img);
        fabricCanvas.sendToBack(img); 
      },
      {
        crossOrigin: "anonymous", 
      }
    );

    return () => {
      fabricCanvas.dispose();
    };
  }, [imageUrl]);

 
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

  const addShape = (shape) => {
    if (!canvas) return;
    let shapeObj;

    switch (shape) {
      case "circle":
        shapeObj = new fabric.Circle({ radius: 40, fill: "red", left: 60, top: 80 });
        break;
      case "rectangle":
        shapeObj = new fabric.Rect({ width: 80, height: 50, fill: "green", left: 50, top: 50 });
        break;
      case "triangle":
        shapeObj = new fabric.Triangle({ width: 60, height: 60, fill: "blue", left: 50, top: 50 });
        break;
      default:
        return;
    }
    canvas.add(shapeObj);
    canvas.renderAll();
  };


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
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        className="border border-gray-400 shadow-md"
      />
      
      {/* Controls */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button onClick={addText} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Caption
        </button>
        <button onClick={() => addShape("circle")} className="px-4 py-2 bg-red-500 text-white rounded">
          Add Circle
        </button>
        <button onClick={() => addShape("rectangle")} className="px-4 py-2 bg-green-500 text-white rounded">
          Add Rectangle
        </button>
        <button onClick={() => addShape("triangle")} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Add Triangle
        </button>
        <button onClick={downloadImage} className="px-4 py-2 bg-black text-white rounded">
          Download Image
        </button>
      </div>
    </div>
  );
};

export default EditorPage;
