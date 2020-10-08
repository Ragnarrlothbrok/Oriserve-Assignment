import {
  GET_PHOTO,
  PHOTO_LOADING,
  GET_PHOTOS,
  CLEAR_CURRENT_PHOTO,
} from "../actions/types";

const initialState = {
  photo: null,
  photos: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PHOTO_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PHOTO:
      return {
        ...state,
        photo: action.payload,
        loading: false,
      };
    case GET_PHOTOS:
      return {
        ...state,
        photos: action.payload,
        loading: false,
      };

    case CLEAR_CURRENT_PHOTO:
      return {
        ...state,
        photo: null,
      };
    default:
      return state;
  }
}
