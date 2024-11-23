import React, { useState } from "react";
import { useSelector } from "react-redux";
import { addArticle } from "../../services/operations/articleApi";

const ConfrenceResearchArticleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: [""],
    volume: "",
    issues: "",
    pageNoStart: "",
    pageNoEnd: "",
    link: "",
    conferenceName: "",
    type: "Conference",
    month: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Handle adding a new author
  const handleIncrement = () => {
    setFormData((prevData) => ({
      ...prevData,
      authors: [...prevData.authors, ""],
    }));
  };

  // Handle removing an author
  const handleDecrement = () => {
    if (formData.authors.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        authors: prevData.authors.slice(0, -1),
      }));
    }
  };

  // Handle individual author input changes
  const handleAuthorChange = (index, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = value;
    setFormData({ ...formData, authors: updatedAuthors });
  };

  // Handle input changes for other fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await addArticle(formData, token);
      if (response) {
        console.log("Article uploaded successfully:", response);
        setFormData({
          title: "",
          authors: [""],
          type: "Conference",
          volume: "",
          issues: "",
          pageNoStart: "",
          pageNoEnd: "",
          link: "",
          conferenceName: "",
          month: "",
          year: "",
        });
      }
    } catch (error) {
      console.error("Error uploading article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-10">
      <div className="max-w-6xl border mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
          Submit Your Research Article
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter the title of your research article"
              required
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Authors</label>
            {formData.authors.map((author, index) => (
              <div key={index} className="flex items-center space-x-4 mt-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  className="flex-grow block border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder={`Author ${index + 1}`}
                  required
                />
              </div>
            ))}
            <div className="flex items-center mt-4 space-x-4">
              <button
                type="button"
                onClick={handleIncrement}
                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Add Author
              </button>
              {formData.authors.length > 1 && (
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                  Remove Author
                </button>
              )}
            </div>
          </div>

          {/* Conference Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Conference Name</label>
            <input
              type="text"
              name="conferenceName"
              value={formData.conferenceName}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="E.g., AI, Machine Learning, Robotics"
              required
            />
          </div>

          

          {/* Volume */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Volume</label>
            <input
              type="text"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Provide a volume for your research"
              required
            />
          </div>

          {/* Page Numbers */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Pages</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                name="pageNoStart"
                value={formData.pageNoStart}
                onChange={handleChange}
                min={1}
                className="mt-2 block w-[100px] border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Start Page"
                required
              />
              <h1 className="text-sm font-semibold text-gray-700">To</h1>
              <input
                type="number"
                name="pageNoEnd"
                value={formData.pageNoEnd}
                onChange={handleChange}
                min={1}
                className="mt-2 block w-[100px] border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="End Page"
                required
              />
            </div>
          </div>
          {/* Month and Year */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-lg font-semibold text-gray-700">Month</label>
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Month of publication"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-lg font-semibold text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Year of publication"
                required
              />
            </div>
          </div>

          {/* Link (Changed to input instead of textarea) */}
          <div>
            <label className="block text-lg font-semibold text-gray-700">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter the link to your research"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md text-lg font-bold hover:bg-blue-700 transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfrenceResearchArticleForm;
