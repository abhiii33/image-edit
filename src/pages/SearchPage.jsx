import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ACCESS_KEY = "TmW_vLLfBphslhb7m9psnIj3wJ7bMMyV6nSb76tXrQ8";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchImages = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${ACCESS_KEY}&per_page=12`
      );
      setImages(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Image Search</h1>
        
        {/* Search Form */}
        <form onSubmit={searchImages} className="flex mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-pulse text-gray-500">Loading images...</div>
          </div>
        )}

        {/* Horizontal Cards Container */}
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={image.urls.small}
                  alt={image.alt_description || "Unsplash image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <button
                  onClick={() => navigate(`/edit/${encodeURIComponent(image.urls.regular)}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Image
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Edit yout image here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;