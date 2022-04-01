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


