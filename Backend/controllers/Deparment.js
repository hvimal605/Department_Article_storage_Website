
const Department = require('../models/Department');
const PendingFacultyRegistration = require('../models/Pendingfaculty');
const Profile = require('../models/Profile');
const User = require('../models/user');
const mailSender = require('../utils/mailSender');


exports.AddDepartment = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Department name is required" });
        }

        const existingDept = await Department.findOne({ name });
        if (existingDept) {
            return res.status(400).json({ error: "Department already exists" });
        }

        const savedDept = await Department.create({
            name,
        });

        res.status(201).json({
            success: true,
            message: "Department add successfully",
            department: savedDept,
        });
    } catch (error) {
        console.error("Error creating department:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.fetchDepartmentNames = async (req, res) => {
    try {
        const departments = await Department.find({}, "name");

        if (departments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No departments found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department names fetched successfully",
            departments,
        });
    } catch (error) {
        console.error("Error fetching department names:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching department names. Please try again.",
        });
    }
};




exports.deleteFaculty = async (req, res) => {
    const {  facultyId } = req.body;


    const hodId = req.user.id; 
    // console.log("ye kiya h bahi",hodId)
    const hod = await User.findById(hodId).populate("department");
    
    
    if (!hod || hod.accountType !== "HOD") {
        return res.status(403).json({ success: false, message: "Access denied." });
    }

    const departmentId = hod.department;
    

    try {
        // Check if the department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        // Check if the faculty exists in the department
        const facultyIndex = department.faculty.findIndex(faculty => faculty._id.toString() === facultyId);
        if (facultyIndex === -1) {
            return res.status(404).json({ message: "Faculty member not found" });
        }

        // Remove the faculty member
        department.faculty.splice(facultyIndex, 1);

        // Save the updated department
        await department.save();

        res.status(200).json({ message: "Faculty member deleted successfully", department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.approveFacultyRegistration = async (req, res) => {
    try {
        const { registrationId, action } = req.body; 
        // Validate the action
        if (action !== 'approve' && action !== 'reject') {
            return res.status(400).json({
                success: false,
                message: "Invalid action",
            });
        }

        // Find the pending faculty registration
        const pendingRegistration = await PendingFacultyRegistration.findById(registrationId);
        if (!pendingRegistration) {
            return res.status(404).json({
                success: false,
                message: "Pending registration not found",
            });
        }

        if (action === 'approve') {
            // Approve the registration and move it to the User collection
            const dept = await Department.findById(pendingRegistration.department);
            if (!dept) {
                return res.status(404).json({
                    success: false,
                    message: "Department not found",
                });
            }

              // Create profile entry
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
            facebookUrl: null,
            instagramUrl: null,
            linkedInUrl: null,
            twitterUrl: null,
        });

            // Create the user and add them to the department
            const user = await User.create({
                Name: pendingRegistration.Name,
                email: pendingRegistration.email,
                password: pendingRegistration.password, 
                accountType: 'Faculty',
                department: pendingRegistration.department,
                additionalDetails: profileDetails._id,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${pendingRegistration.Name}`,
            });

            // Add user to faculty list
            dept.faculty.push(user._id);
            await dept.save();

            // Remove the pending registration
            await PendingFacultyRegistration.findByIdAndDelete(registrationId);
            mailSender(user.email , 'Your account approved!!','now you can login and  then  publish article easily ')
            return res.status(200).json({
                success: true,
                message: "Faculty registration approved successfully",
                user,
            });
        } else if (action === 'reject') {
            // Reject the registration and remove from pending
            await PendingFacultyRegistration.findByIdAndDelete(registrationId);

            return res.status(200).json({
                success: true,
                message: "Faculty registration rejected",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the request",
        });
    }
};

exports.getFaculty= async (req, res) => {
    try {
        const hodId = req.user.id; 
        // console.log("ye kiya h bahi",hodId)
        const hod = await User.findById(hodId).populate("department");
        
        if (!hod || hod.accountType !== "HOD") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const departmentId = hod.department;
        const department = await Department.findById(departmentId)
            .populate("faculty")
            .exec();

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found." });
        }

        const pendingFaculty = await PendingFacultyRegistration.find({ department: departmentId })
            .select("Name email status createdAt");

        res.status(200).json({
            success: true,
            faculty: department.faculty,
            pendingFaculty,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

exports.getFacultyDetailsByID= async (req, res) => {
    try {
        const hodId = req.user.id; 
        // console.log("ye kiya h bahi",hodId)
        const hod = await User.findById(hodId).populate("department");
        
        if (!hod || hod.accountType !== "HOD") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const departmentId = hod.department;
        const department = await Department.findById(departmentId)
            .populate("faculty")
            .exec();

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found." });
        }

        const pendingFaculty = await PendingFacultyRegistration.find({ department: departmentId })
            .select("Name email status createdAt");

        res.status(200).json({
            success: true,
            faculty: department.faculty,
            pendingFaculty,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
}


exports.getFacultyByDepartment = async (req, res) => {
    const { deptID } = req.body;
  
    
  
    try {
      // Find the department by ID and populate the faculty field
      const department = await Department.findById(deptID).populate("faculty");
  
    //   console.log("Department Data:", department); 
  
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
  
      res.status(200).json({ faculty: department.faculty });
    } catch (error) {
      console.error("Error retrieving department:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  



  


