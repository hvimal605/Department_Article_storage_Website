import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Signupbg from "../../assets/image/articlebg.jpg";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../slices/authSlice";
import toast from "react-hot-toast";
import { sendOtp } from "../../services/operations/authApi";
import { fetchDepartmentNames } from "../../services/operations/DepartmentApi";
import { apiConnector } from "../../services/apiconnector";
import { departmentEndpoints } from "../../services/apis";



const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "faculty",
  });

  const { Name, email, password, confirmPassword, department, role } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    if (!department) {
      toast.error("Please select a department");
      return;
    }

    const signupData = {
      ...formData,
    };

    dispatch(setSignupData(signupData));
   
    dispatch(sendOtp(formData.email, navigate));

    setFormData({
      Name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      role: "faculty",
    });
  };
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    ; (async () => {

      try {
        const res = await apiConnector("GET", departmentEndpoints.SHOW_ALL_DEPARTMENT)
  
        setDepartments(res.data.departments)
      } catch (error) {
        console.log("Could not fetch Department names.", error)
      }

    })()
  }, [])

  return (
    <div className="relative h-[100vh] flex items-center justify-center">
      <img
        src={Signupbg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="bg-gradient-to-r from-black to-transparent absolute inset-0 w-full h-full opacity-80"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-10 rounded-xl shadow-lg w-[90%] max-w-lg">
        <h2 className="text-2xl text-center mb-6 font-extrabold text-gray-800">
          Create Your Account
        </h2>
        <form onSubmit={handleOnSubmit}>
   
                 <div className="mb-5 flex justify-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="faculty"
                checked={role === "faculty"}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700 text-sm font-semibold">Faculty</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="hod"
                checked={role === "hod"}
                onChange={handleOnChange}
                className="cursor-pointer"
              />
              <span className="text-gray-700 text-sm font-semibold">HoD</span>
            </label>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              placeholder="Enter Name"
              name="Name"
              value={Name}
              required
              onChange={handleOnChange}
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              required
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Department
            </label>
            <select
              name="department"
              value={department}
              onChange={handleOnChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>


          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-5 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </form>
        <div className="flex justify-center mt-8 text-sm text-gray-600">
          <Link to="/login" className="hover:text-indigo-500 hover:underline transition-all">
            Already have an account? <span className="font-semibold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
