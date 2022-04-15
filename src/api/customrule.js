import fetch from "@/utils/fetch";

export const fetchTableData = (data) => {
  return fetch({
    url: "/manager/pageList",
    method: "post",
    data: data,
  });
};

export const deleteList = (id) => {
  return fetch({
    url: `/manager/deleteOneRule/${id}`,
    method: "get",
  });
};

export const modifyList = (data) => {
  return fetch({
    url: `/manager/batchChangeRules`,
    method: "post",
    data,
  });
};

export const fetchDetail = (id) => {
  return fetch({
    url: `/manager/viewOneRule/${id}`,
    method: "get",
  });
};

export const fetchObjectList = (data) => {
  return fetch({
    url: `/ruleEntityObject/page`,
    method: "post",
    data,
  });
};

export const fetchObjectDetail = (id) => {
  return fetch({
    url: `/ruleEntityObject/detail/${id}`,
    method: "post",
  });
};

export const createRuleObject = (data) => {
  return fetch({
    url: `/manager/saveOneRule`,
    method: "post",
    data,
  });
};

export const updateRuleObject = (data) => {
  return fetch({
    url: `/manager/updateOneRule`,
    method: "post",
    data,
  });
};

export const fetchTestData = (ruleId) => {
  return fetch({
    url: `/filedProcess/getMockParam/${ruleId}`,
    method: "get",
  });
};

export const upDateTestData = (data) => {
  return fetch({
    url: `/filedProcess/mockValidateRule`,
    method: "post",
    data,
  });
};
