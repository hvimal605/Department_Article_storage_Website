import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiConnector } from "../../services/apiconnector";
import { departmentEndpoints } from "../../services/apis";

const SearchFilter = () => {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch departments on component mount
    (async () => {
      try {
        const res = await apiConnector("GET", departmentEndpoints.SHOW_ALL_DEPARTMENT);
        console.log("Departments fetched:", res.data.departments); // Debug log
        setDepartments(res.data.departments);
      } catch (error) {
        console.error("Could not fetch departments:", error);
        setError("Failed to load departments.");
      }
    })();
  }, []);

  useEffect(() => {
    // Fetch faculties when the selected department changes
    if (selectedDepartment) {
      setLoading(true);
      setError("");
      (async () => {
        try {
          const res = await apiConnector(
            "POST",
            { deptID: selectedDepartment },
            "http://localhost:5000/api/v1/department/getFacultyByDepartment"
          );
          console.log("Faculties fetched for department:", res.data.faculty); // Debug log
          setFaculties(res.data.faculty);
        } catch (error) {
          console.error("Could not fetch faculty for department:", error);
          setError("Failed to load faculty members.");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setFaculties([]); // Reset faculties if no department is selected
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedFaculty(""); // Reset faculty when department changes
  };

  const handleSearch = async () => {
    const query = {
      departmentId: selectedDepartment,
      facultyId: selectedFaculty,
      year,
      month,
    };

    console.log("Search query:", query); // Debugging log
    setArticlesLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/search-articles", { params: query });
      console.log("Articles response:", res.data); // Debugging log
      setArticles(res.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setArticlesLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Search Articles</h1>

      {/* Department Dropdown */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className="mt-2 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty Dropdown */}
      <div className="mb-4">
        <label className="block text-lg font-medium">Faculty:</label>
        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          disabled={!faculties.length || loading}
          className="mt-2 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Faculty</option>
          {loading ? (
            <option>Loading...</option>
          ) : (
            faculties.map((faculty) => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Year and Month Inputs */}
      <div className="mb-4 flex items-center gap-4">
        <div className="w-1/2">
          <label className="block text-lg font-medium">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(value) && value.length <= 4) setYear(value); // Limit to 4 digits
            }}
            placeholder="Enter Year"
            className="mt-2 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-lg font-medium">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-2 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Month</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {articlesLoading ? "Searching..." : "Search"}
      </button>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Articles List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Articles</h2>
        {articlesLoading ? (
          <p className="mt-4 text-gray-500">Loading articles...</p>
        ) : articles.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {articles.map((article) => (
              <li key={article._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">Authors: {article.authors.join(", ")}</p>
                <p className="text-sm text-gray-600">Year: {article.year}</p>
                <p className="text-sm text-gray-600">Month: {article.month}</p>
                <p className="text-sm text-gray-600">Publisher: {article.publisher?.Name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No articles found for the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
