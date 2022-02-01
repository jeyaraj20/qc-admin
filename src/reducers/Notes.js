import {
    GET_MASTER_GATEGORY_SUCCESS,
    GET_CHAPTERS_SUCCESS,
    GET_NOTES_SUCCESS,
    GET_VIDEOS_SUCCESS
  } from "constants/ActionTypes";
  
  const INIT_STATE = {
    masterCategory : { 
      category:[],
      count: 0,
    },
    chapters : [],
    chaptersCount : 0,
    activeCount : 0,
    inActiveCount : 0,
    notes : [],
    notesCount : 0,
    videos : []
  };
  
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_MASTER_GATEGORY_SUCCESS: {
        return {
          ...state,
          masterCategory: action.payload
        }
      }
      case GET_CHAPTERS_SUCCESS: {
        return {
          ...state,
          chapters: action.payload.chapters,
          chaptersCount : action.payload.count,
          activeCount : action.payload.activeCount,
          inActiveCount : action.payload.inActiveCount
        }
      }
      case GET_NOTES_SUCCESS: {
        return {
          ...state,
          notes : action.payload
        }
      }
      case GET_VIDEOS_SUCCESS: {
        return {
          ...state,
          videos : action.payload
        }
      }
      default:
        return state;
    }
  }
  