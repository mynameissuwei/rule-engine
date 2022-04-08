import request from "@/utils/request";
import request2 from "@/utils/request2";

export const fetchTableData = (data) => {
  return request({
    url: "/manager/pageList",
    method: "post",
    data: data,
  });
};

export const deleteList = (id) => {
  return request({
    url: `/manager/deleteOneRule/${id}`,
    method: "get",
  });
};

export const modifyList = (data) => {
  return request({
    url: `/manager/batchChangeRules`,
    method: "post",
    data,
  });
};

export const fetchDetail = (id) => {
  return request({
    url: `/manager/viewOneRule/${id}`,
    method: "get",
  });
};

export const fetchObjectList = (data) => {
  return request({
    url: `/ruleEntityObject/page`,
    method: "post",
    data,
  });
};

export const fetchObjectDetail = (id) => {
  return request({
    url: `/ruleEntityObject/detail/${id}`,
    method: "post",
  });
};

export const createRuleObject = (data) => {
  return request({
    url: `/manager/saveOneRule`,
    method: "post",
    data,
  });
};

export const updateRuleObject = (data) => {
  return request({
    url: `/manager/updateOneRule`,
    method: "post",
    data,
  });
};

export const fetchTestData = (ruleId) => {
  return request({
    url: `/filedProcess/getMockParam/${ruleId}`,
    method: "get",
  });
};

export const upDateTestData = (data) => {
  return request({
    url: `/filedProcess/mockValidateRule`,
    method: "post",
    data,
  });
};
