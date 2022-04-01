import request from "../utils/request";

/**
 * 分页获取规则库列表
 */
export function getRuleRepository (pageNum,pageSize){
  return request({
    method:'post',
    url:'/ruleGroup/page',
    data:{pageNum,pageSize}
  })
}

/**
 * 删除规则库
 */
export function deleteRuleRepository (ids){
  return request({
    method:'post',
    url:'/ruleGroup/delete',
    data:[ids]
  })
}

/**
 * 新建修改规则库
 */
export function addRuleRepository (requestBody){
  return request({
    method:'post',
    url:'/ruleGroup/addOrUpdate',
    data:requestBody
  })
}

/**
 * 规则库详情
 */
export function getRuleRepositoryDetail (id){
  return request({
    method:'post',
    url:'/ruleGroup/detail/{id}',
    data: {id}
  })
}