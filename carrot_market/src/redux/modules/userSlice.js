import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import instance from '../../shared/axios'
//미들웨어
//login
export const loginUserDB = ( users, close ) => {
  return async function (dispatch) {
    console.log('나는 유저스',users)
    await instance
      //서버에 데이터 값 넣기
      // .post("http://54.180.86.234:8080/user/login", users)
      .post("/user/login", users)
      .then((response) => {
        console.log(response)
        const accessToken = response.data.token;
        //서버에서 받은 토큰 저장
        localStorage.setItem("token", accessToken);
        // 저장된 토큰으로 login 여부 확인
        // if (accessToken) {
        //   dispatch(loginUser(true));
        //   close();
        // }
      })
      .catch(function (error) {
        // 로그인 실패 시 에러메시지
        console.log(error)
        window.alert(error.response.data.errorMessage);
      });
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
  },

  reducers: {
    loginUser: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const { loginUser } = userSlice.actions;
export default userSlice.reducer;
