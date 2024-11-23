
const express = require("express")
const router = express.Router()




const { auth, isAdmin, isHOD } = require("../middleware/auth")
const { AddDepartment, fetchDepartmentNames, deleteFaculty, approveFacultyRegistration, getFaculty, getFacultyByDepartment } = require("../controllers/Deparment")


// article

router.post('/AddDepartment' ,auth, isAdmin, AddDepartment)
router.get('/FetchDepartmentNames' , fetchDepartmentNames)
router.delete('/deleteFaculty' ,auth,isHOD,  deleteFaculty)
router.put('/updateFacultyRegistrationStatus', auth ,isHOD, approveFacultyRegistration)
router.get('/getFaculty',auth,isHOD,getFaculty)
router.get('/getFaculty',auth,isHOD,getFaculty)
router.post('/getFacultyByDepartment',getFacultyByDepartment)
module.exports = router