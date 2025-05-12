import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../slices/postsSlice';
import commentsReducer from '../slices/commentsSlice';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentsReducer,
    },
})

export default store;