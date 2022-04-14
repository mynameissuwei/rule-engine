const state = {
  ruleData: {
    id: "",
    ruleGroupName: "",
    ruleGroupCode: "",
    ruleGroupDesc: "",
  },
};

const mutations = {
  SET_RULEDATA: (state, ruleData) => {
    state.ruleData = ruleData;
  },
};

const actions = {
  setRuleData({ commit }, ruleData) {
    commit("SET_RULEDATA", ruleData);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
