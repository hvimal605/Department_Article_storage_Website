import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";
import { logout } from "./authApi";

const { GET_USER_ALL_DETAILS_API } = profileEndpoints;

export function fetchUserAllDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_ALL_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_USER_DETAILS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Generate user image URL if not provided
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

      // Set user data in Redux store
      dispatch(setUser({ ...response.data.data, image: userImage }));
      toast.success("User details fetched successfully!");
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error("Could Not Get User Details");
      dispatch(logout(navigate)); // Logout user on error
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export function fetchUserDetailsById(token, id) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", GET_USER_ALL_DETAILS_API, id, {
        Authorization: `Bearer ${token}`,
      });
      console.log("GET_USER_DETAILS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Generate user image URL if not provided
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

      // Set user data in Redux store
      dispatch(setUser({ ...response.data.data, image: userImage }));
      toast.success("User details fetched successfully!");
    } catch (error) {
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error("Could Not Get User Details");
      dispatch(logout(navigate)); // Logout user on error
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}