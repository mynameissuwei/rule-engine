import request from "@/utils/request";

export const fetchTableData = (data) => {
  return request({
    url: "/manager/pageList",
    method: "post",
    data: data,
  });
};

export const deleteList = (id) => {
  return request({
    url: `/rule/manager/deleteOneRule/${id}`,
    method: "get",
  });
};

export const modifyList = (data) => {
  return request({
    url: `/rule/manager/batchChangeRules`,
    method: "post",
    data,
  });
};

export const fetchDetail = (id) => {
  return request({
    url: `/rule/manager/viewOneRule/${id}`,
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

//规则详情
export const fetchRuleObjectDetail = (data) => {
  return request({
    url: ` /rule/viewRuleConfigDetails	`,
    method: "post",
    data,
  });
};

export const createRuleObject = (data) => {
  return request({
    url: `/rule/saveObjectBusinessRule`,
    method: "post",
    data,
  });
};
