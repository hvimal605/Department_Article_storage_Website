const BASE_URL = "http://localhost:5000/api/v1"


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}


// Article ENDPOINTS
export const articleEndpoints = {
  GET_ALL_ARTICLE_API: BASE_URL + "/article/getArticles",
  GET_RECENT_ARTICLE_API: BASE_URL + "/article/getRecentArticle",

  GET_ARTICLE_Details_API: BASE_URL + "/article/getArticleDetails",
  GET_AUTHOR_Details_API: BASE_URL + "/article/getAuthorDetails",
  EDIT_ARTICLE_API: BASE_URL + "/article/editArticle",

  CREATE_ARTICLE_API: BASE_URL + "/article/UploadArticle",

  DELETE_ARTICLE_API: BASE_URL + "/article/deleteArticle",



}

//profile endpoints 

export const profileEndpoints = {
  GET_USER_ALL_DETAILS_API : BASE_URL + "/profile/getUserDetails"
}

export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
}


export const departmentEndpoints = {
  SHOW_ALL_DEPARTMENT: BASE_URL + "/department/FetchDepartmentNames",
 
}


export const facultyEndpoints = {
  UPDATE_FACULTY_STATUS_API: BASE_URL +"/department/updateFacultyRegistrationStatus",
  GET_FACULTY_LIST_API: BASE_URL + "/department/getFaculty",
  DELETE_FACULTY_API : BASE_URL + "/department/deleteFaculty",
  SHOW_ALL_FacultyById: BASE_URL + "/department/getFacultyByDepartment"
 
}