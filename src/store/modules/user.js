import { fetchAccount } from "@/api/user";
import router from "@/router";

const getDefaultState = () => {
  return {
    authId: "",
    token: "",
    userId: "",
    username: "",
    nickName: "",
    hasTenant: true,
    tenantId: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_AUTHID: (state, authId) => {
    state.authId = authId;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERID: (state, userId) => {
    state.userId = userId;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName;
  },
  SET_HASTENANT: (state, hasTenant) => {
    state.hasTenant = hasTenant;
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId;
  },
};

const actions = {
  // 获取账户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      fetchAccount()
        .then((response) => {
          const { data } = response;

          const infoData = data.data;
          if (!data) {
            reject("获取账户信息失败, 请重新登陆.");
          }

          const {
            userId,
            username,
            nickName,
            hasTenant,
            tenantId,
            ennUnifiedCsrfToken,
            ennUnifiedAuthorization,
          } = infoData;
          commit("SET_USERID", userId);
          commit("SET_USERNAME", username);
          commit("SET_NICKNAME", nickName);
          commit("SET_HASTENANT", hasTenant);
          commit("SET_TENANTID", tenantId);
          commit("SET_TOKEN", ennUnifiedCsrfToken);
          commit("SET_AUTHID", ennUnifiedAuthorization);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
