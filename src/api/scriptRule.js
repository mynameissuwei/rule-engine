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
