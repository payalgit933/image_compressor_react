import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import "./compressor.css";

const Compressor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [quality, setQuality] = useState(50);
  const [error, setError] = useState("");
  const previewRef = useRef(null); // 🔹 Ref for preview

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalImage(file);
      setCompressedImage(null);
      setError("");
    } else {
      setError("Please upload a valid image.");
    }
  };

  const handleCompress = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      const compressed = await imageCompression(originalImage, options);
      setCompressedImage(compressed);

      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError("Compression failed.");
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    const url = URL.createObjectURL(compressedImage);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${originalImage.name}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-3 flex items-center bg-pink-600">
        <img src="/logo.png" alt="ic" className="w-14 h-14" />
        <h3 className="font-bold">Image Compressor</h3>
      </div>

      <div className="mt-12 text-center">
        <h2>Image Compressor</h2>
        <p className="mt-2 text-gray-500">Web App to Compress Image files</p>
      </div>

      <div className="flex flex-col items-center justify-center border-4 border-dashed border-blue-400 p-8 rounded-md bg-blue-100 text-center max-w-md mx-auto mt-10">
        <div className="text-5xl mb-4 text-blue-700">📷</div>
        <label
          htmlFor="fileUpload"
          className="bg-black text-white px-6 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition duration-200"
        >
          Select Images
        </label>
        <input id="fileUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden"
        />
        <p className="mt-2 text-sm text-gray-600">or, drag and drop images here</p>
      </div>

      {originalImage && (
        <div className="text-center mt-6">
          <label>Quality: {quality}%</label>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-1/2"
          />
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={handleCompress} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Compress
        </button>
      </div>

      {compressedImage && (
        <div ref={previewRef} className="text-center mt-8">
          <h4 className="mb-2">Preview:</h4>
          <img
            src={URL.createObjectURL(compressedImage)}
            alt="Compressed"
            className="mx-auto max-w-xs border border-gray-700"
          />
          <br />
          <button onClick={handleDownload} className="mt-4 mb-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Download
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-center mt-4 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default Compressor;
