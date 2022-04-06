import request from '@/utils/request'

export const scriptRuleList = (params) => {
  return request({
    url: `/scriptRule/page?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
    method: 'post',
    data: params
  })
}

/**
 *新建脚本规则
 */
export function addScriptRule (requestBody){
    return request({
        method:'post',
        url:'/scriptRule/save',
        data:requestBody
    })
}

/**
 * 分页展示脚本规则
 */
export const pageScriptRule = (params) => {
    return request({
        url:`/scriptRule/page?pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
        method:'post',
        data:params
    })
}

/**
 * 根据id删除脚本规则
 */
export function deleteScriptRuleById (id){
    return request({
        method:'post',
        url:'/scriptRule/deleteScriptRuleById/{id}',
        data:id
    })
}

/**
 *脚本规则编辑
 */
export function updateScriptRuleById (requestBody){
    return request({
        method:'post',
        url:'/scriptRule/updateScriptRuleById',
        data:requestBody
    })
}

/**
 * 根据id查看脚本规则详情
 */
export function queryScriptRuleById (requestBody){
    return request({
        method:'post',
        url:'/scriptRule/queryScriptRuleById/{id}',
        data:requestBody
    })
}

/**
 * 更改脚本规则状态
 */
export function updateScriptRuleStatus (requestBody){
    return request({
        method:'post',
        url:'/scriptRule/updateBatchStatus',
        data:requestBody
    })
}