import { createSlice } from "@reduxjs/toolkit";
import instance from "../../shared/axios";

//middlewares
// 컨텐츠 로드
export const loadContentDB = () => {
  return async function (dispatch) {
    await instance
      .get('/api/posts', { params: { lastPostId : 99999 , size: 12 } })
      // .get("/api/posts")
      .then((response) => {
        const data = response.data;
        dispatch(loadContent({ data: data }));
      });
  };
};
// 무한스크롤시 컨텐츠를 더 로드
export const loadMoreContentDB = ()=>{
  return async function (dispatch, getState) {
    const content = getState().content.content_list
    const lastIndex = content[content.length-1].postID;
    await instance
      .get('/api/posts', { params: { lastPostId : lastIndex, size: 12 } })
      // .get("/api/posts")
      .then((response) => {
        const new_data = [...content, ...response.data];
        dispatch(loadContent({ data: new_data }));
      });
}
}
// 디테일 페이지에서 해당 컨텐츠만 로드
export const loadDetailContentDB = (postID) => {
  return async function (dispatch) {
    await instance.get(`/api/posts/${postID}`).then((response) => {
      dispatch(loadDetailContent(response.data));
    });
  };
};
export const loadSearchContentDB = (search) => {
  return async function (dispatch, getState) {
    // const page = getState().content.page;
    await instance
      .get('/api/posts', { params: { search: search } })
      .then((response) => {
        const data = response.data;
        dispatch(loadSearchContent(data));
      });
  };
};
// 컨텐츠 생성
export const createContentDB = (formData) => {
  return async function (dispatch) {
    await instance
      .post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch(createContent(response.data));
        window.location.replace('/contents');
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
// 컨텐츠 수정
export const updateContentDB = (data,postID) => {
  return async function (dispatch) {
    console.log(data);
    await instance
      .put(`/api/posts/${postID}`, data ,{headers:{
        "Content-Type": "multipart/form-data",
      }})
      .then((response) => {
        console.log(response)
        dispatch(updateContent(response.data));
        window.location.replace('/contents');
      }).catch((error) =>{
        console.log(error)
      })
  };
};
// 컨텐츠 삭제
export const deleteContentDB = (postID) => {
  return async function (dispatch) {
    await instance.delete(`/api/posts/${postID}`).then((response) => {
      console.log("삭제리스폰스", response.data);
      dispatch(deleteContent(postID));
      window.location.replace("/contents");
    });
  };
};

const contentSlice = createSlice({
  name: "content",
  initialState: {
    content_list: [],
    detail_list: [],
    search_list:[],
  },
  reducers: {
    loadContent: (state, action) => {
      state.content_list = action.payload.data;
    },
    loadDetailContent: (state, action) => {
      state.detail_list = action.payload;
    },
    loadSearchContent: (state, action) => {
      state.search_list = action.payload;
    },
    heartLoadContent: (state, action) => {
      state.content_list = action.payload;
    },
    createContent: (state, action) => {
      state.content_list.push(action.payload);
    },
    updateContent: (state, action) => {
      const index = state.content_list.findIndex(
        (v) => v.id === action.payload.id
      );
      state.content_list[index] = action.payload;
    },
    deleteContent: (state, action) => {
      const new_content = state.content_list.filter(
        (v, i) => v.postID !== action.payload
      );
      state.content_list = new_content;
    },
  },
});

export const {
  loadContent,
  loadDetailContent,
  loadSearchContent,
  heartLoadContent,
  createContent,
  updateContent,
  deleteContent,
} = contentSlice.actions;
export default contentSlice.reducer;
