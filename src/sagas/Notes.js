import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    GET_MASTER_GATEGORY,
    GET_NOTES,
    GET_CHAPTERS,
    GET_VIDEOS
} from "constants/ActionTypes";
import { getMasterCategorySuccess, getNotesSuccess, getChaptersSuccess, getVideosSuccess } from "actions/Notes";

import * as exammainCategoryService from '../services/exammainCategoryService';
import * as notesService from '../services/notesService';
import * as videoService from '../services/videoService';

function* getMasterCategorySaga() {
    try {
        const data = yield call(exammainCategoryService.getExamMainCategory);
        yield put(getMasterCategorySuccess(data.data));
    } catch (err) {
        console.log(err , 'error')
    }
}

function* getChapersSaga({payload}) {
    try {
        const data = yield call(notesService.getChapters, payload);
        yield put(getChaptersSuccess(data.data));
    } catch (err) {
        console.log(err , 'error')
    }
}

function* getNotesSaga({payload}) {
    try {
        const data = yield call(notesService.getNotes, payload);
        if( data && data.data && data.data.statusCode === 200 ){
            yield put(getNotesSuccess(data.data.data));
        }else{
            yield put(getNotesSuccess([]));
        }
    } catch (err) {
        console.log(err , 'error')
    }
}

function* getVideosSaga({payload}) {
    try {
        const data = yield call(videoService.getVideos, payload);
        
        if( data && data.data && data.data.statusCode === 200 ){
            yield put(getVideosSuccess(data.data.data));
        }else{
            yield put(getVideosSuccess([]));
        }
    } catch (err) {
        console.log(err , 'error')
    }
}

export default function* rootSaga() {
    yield all([takeEvery(GET_MASTER_GATEGORY, getMasterCategorySaga)]);
    yield all([takeEvery(GET_CHAPTERS, getChapersSaga)]);
    yield all([takeEvery(GET_NOTES, getNotesSaga)]);
    yield all([takeEvery(GET_VIDEOS, getVideosSaga)]);
}