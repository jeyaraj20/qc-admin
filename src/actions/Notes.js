import {
    GET_MASTER_GATEGORY,
    GET_MASTER_GATEGORY_SUCCESS,
    GET_NOTES,
    GET_NOTES_SUCCESS,
    GET_CHAPTERS_SUCCESS,
    GET_CHAPTERS,
    GET_VIDEOS,
    GET_VIDEOS_SUCCESS,
} from 'constants/ActionTypes';

export const getMasterCategory = () => {
    return {
        type: GET_MASTER_GATEGORY,
    };
};

export const getChapters = (payload) => {
    return {
        type: GET_CHAPTERS,
        payload : payload
    };
};

export const getNotes = (payload) => {
    return {
        type: GET_NOTES,
        payload : payload
    };
};

export const getVideos = (payload) => {
    return {
        type: GET_VIDEOS,
        payload : payload
    };
};

export const getMasterCategorySuccess = (payload) => {
    return {
        type: GET_MASTER_GATEGORY_SUCCESS,
        payload : payload
    };
};

export const getChaptersSuccess = (payload) => {
    return {
        type: GET_CHAPTERS_SUCCESS,
        payload : payload
    };
};

export const getNotesSuccess = (payload) => {
    return {
        type: GET_NOTES_SUCCESS,
        payload : payload
    };
};

export const getVideosSuccess = (payload) => {
    return {
        type: GET_VIDEOS_SUCCESS,
        payload : payload
    };
};



