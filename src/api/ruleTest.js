import request from '@/utils/request'

export const scriptRuleParam = (params) => {
    return request({
        url: `/test/parameterQuery`,
        method: 'post',
        data: params
    })
}

export const scriptRuleTest = (params) => {
    return request({
        url: `/test/testScript`,
        method: 'post',
        data: params
    })
}


