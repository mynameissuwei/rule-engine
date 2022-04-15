import request from "@/utils/request";

/**
 *分页查询实体对象
 */
export function getEntityObject (requestBody){
  return request({
    method:'post',
    url:'/ruleEntityObject/page',
    data:requestBody
  })
}

/**
 *更新实体对象状态
 */
export function updateEntityObjectStatus (requestBody){
  return request({
    method:'post',
    url:'/ruleEntityObject/updateStatus',
    data:requestBody
  })
}

/**
 *新建或编辑实体对象
 */
export function addOrUpdateEntityObject (requestBody){
  return request({
    method:'post',
    url:'/ruleEntityObject/addOrUpdate',
    data:requestBody
  })
}

/**
 *删除实体对象
 */
export function deleteEntityObject (ids){
  return request({
    method:'post',
    url:'/ruleEntityObject/delete',
    data:[ids]
  })
}

/**
 *查看实体对象详情
 */
export function checkEntityObjectDetail (id){
  return request({
    method:'post',
    url:`/ruleEntityObject/detail/${id}`,
  })
}



