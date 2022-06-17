import { createSlice } from '@reduxjs/toolkit';
import instance from '../../shared/axios';

//middlewares
// 컨텐츠 로드
export const loadContentDB = () => {
    return async function (dispatch, getState) {
        // const page = getState().content.page;
        await instance
            // .get('/api/post/list/', { params: { page: page } })
            .get('/content')
            .then((response) => {
                // const data = getState().content.content_list;
                const data = response.data
                // const new_data = [...data, ...response.data];
                // const new_page = page + 8;
                dispatch(loadContent({ data: data}));
            });
    };
};
// 디테일 페이지에서 해당 컨텐츠만 로드
export const loadDetailContentDB = (id) => {
    return async function (dispatch) {
        await instance.get(`/api/post/list/${id}`).then((response) => {
            dispatch(loadDetailContent(response.data));
        });
    };
};
// 컨텐츠 생성
export const createContentDB = (data) => {
    return async function (dispatch) {
        await instance.post('/api/post', data).then((response) => {
            dispatch(createContent(response.data));
            window.location.replace('/');
        });
    };
};
// 컨텐츠 수정
export const updateContentDB = (data) => {
    return async function (dispatch) {
        await instance
            .put(`/api/post/${data.id}/modify`, data)
            .then((response) => {
                dispatch(updateContent(data));
                window.location.replace('/');
            });
    };
};
// 컨텐츠 삭제
export const deleteContentDB = (data) => {
    return async function (dispatch) {
        await instance.delete(`/api/post/${data}/delete`).then((response) => {
            console.log('삭제리스폰스', response.data);
            dispatch(deleteContent(data));
            window.location.replace('/');
        });
    };
};

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        content_list: [],
        detail_list: [],
        page: 0,
    },
    reducers: {
        loadContent: (state, action) => {
            console.log(action.payload);
            state.content_list = action.payload.data;
            // state.page = action.payload.page;
        },
        loadDetailContent: (state, action) => {
            state.detail_list = action.payload;
        },
        heartLoadContent: (state, action) => {
            state.content_list = action.payload;
        },
        createContent: (state, action) => {
            state.content_list.push(action.payload);
        },
        updateContent: (state, action) => {
            const index = state.content_list.findIndex(
                (v) => v.id === action.payload.id,
            );
            state.content_list[index] = action.payload;
        },
        deleteContent: (state, action) => {
            const new_content = state.content_list.filter(
                (v, i) => i !== action.payload,
            );
            state.content_list = new_content;
        },
    },
});

export const {
    loadContent,
    loadDetailContent,
    heartLoadContent,
    createContent,
    updateContent,
    deleteContent,
} = contentSlice.actions;
export default contentSlice.reducer;