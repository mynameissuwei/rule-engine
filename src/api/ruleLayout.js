import request from "@/utils/request";

export const pageRuleLayoutList = (params) => {
  return request({
    url: `/ruleLayout/page?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    method: 'post',
    data: params
  })
}

export const changeRuleLayoutStatus = (params) => {
  return request({
    url: `/ruleLayout/updateBatchStatus`,
    method: 'post',
    data: params
  })
}

export const removeRuleLayout = (params) => {
  return request({
    url: `/ruleLayout/deleteRuleLayoutInfoById/${params.id}`,
    method: 'post'
  })
}

export const ruleLayoutDetail = (params) => {
  return request({
    url: `/ruleLayout/queryRuleLayoutById/${params.id}`,
    method: 'post'
  })
}

export const saveRuleLayout = (params) => {
  return request({
    url: `/ruleLayout/saveRuleLayout`,
    method: 'post',
    data: params
  })
}

export const editRuleLayout = (params) => {
  return request({
    url: `/ruleLayout/editRuleLayoutInfo`,
    method: 'post',
    data: params
  })
}

export const randomRuleLayoutCode = (prefix) => {
  return request({
    url: `/ruleCode/getCode/${prefix}`,
    method: 'post'
  })
}

