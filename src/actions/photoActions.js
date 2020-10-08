import axios from "axios";
import {
  GET_PHOTO,
  GET_PHOTOS,
  PHOTO_LOADING,
  //   GET_ERRORS,
  CLEAR_CURRENT_PHOTO,
  GET_ERRORS,
  SET_CURRENT_USER,
} from "./types";
import cors from "cors";
import { toast } from "react-toastify";

//get currnt Photo
export const getPhotos = (page) => (dispatch) => {
  dispatch(setPhotoLoading());
  axios
    .get(
      `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=82ef54fdfcec0156b522a6113b807e3e&format=json&nojsoncallback=1&page=${page}`,
      { mode: cors }
    )
    .then((res) => {
      dispatch({
        type: GET_PHOTOS,
        payload: res.data.photos,
      });
      return res.data.photos;
    })
    .catch((err) =>
      dispatch({
        type: GET_PHOTOS,
        payload: {},
      })
    );
};

export const getPhotoByHandle = (handle) => (dispatch) => {
  axios
    .post(`/api/client/accept/${handle}`, { mode: cors })
    .then((res) => {
      toast.success(res.data.message);
      dispatch({
        type: GET_PHOTO,
        payload: {},
      });
    })
    .catch((err) => {
      toast.error("Something went wrong.Please try again later.");
      dispatch({
        type: GET_PHOTO,
        payload: {},
      });
    });
};

export const setPhotoLoading = () => {
  return {
    type: PHOTO_LOADING,
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PHOTO,
  };
};
