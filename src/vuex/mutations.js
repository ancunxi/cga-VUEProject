export default {
  //用户信息
  SAVE_USER(state, userinfo) {
    state.userinfo = userinfo;
  },
  //token
  UPDATE_TOKEN(state, token) {
    state.token = token;
  } 
}