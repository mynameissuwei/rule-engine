const getters = {
  authId: (state) => state.user.authId,
  token: (state) => state.user.token,
  userId: (state) => state.user.userId,
  username: (state) => state.user.username,
  nickName: (state) => state.user.nickName,
  hasTenant: (state) => state.user.hasTenant,
  tenantId: (state) => state.user.tenantId,
};
export default getters;
