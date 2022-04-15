const ruleObjectFieldResVoList = [
  {
    id: "26",
    fieldName: "客户gg",
    fieldCode: "kehuGG",
    fieldType: "java.lang.String",
    fieldEnum: "dog;cat;pig",
    calibratorType: "VALUE_CONTAIN",
    targetContains '|' id
  },
  {
    id: "27",
    fieldName: "客户hh",
    fieldCode: "kehuHH",
    fieldType: "java.lang.String",
    fieldEnum: "",
    calibratorType: "STRING_EQUALS",
    "STRING_EQUALS"   "targetValue"
    
  },
  {
    id: "28",
    fieldName: "客户kk",
    fieldCode: "kehuKK",
    fieldType: "java.lang.Integer",
    fieldEnum: "11;22;33",
    calibratorType: "VALUE_CONTAIN",
  },
  {
    id: "29",
    fieldName: "客户ll",
    fieldCode: "kehuLL",
    fieldType: "java.lang.Integer",
    fieldEnum: "",
    calibratorType: "INTEGER_RANGE",
    rangeType minValue maxValue
  },
  {
    id: "30",
    fieldName: "客户mm",
    fieldCode: "kehuMM",
    
    fieldPath

    $.objectCode.fieldCode
    fieldType: "java.lang.Double",
    dataType
    fieldEnum: "",
    calibratorType: "DOUBLE_RANGE",
    ruleType

  },
  {
    id: "31",
    fieldName: "客户nn",
    fieldCode: "kehuNN",
    fieldType: "java.math.BigDecimal",
    fieldEnum: "",
    calibratorType: "NUMBER_RANGE",
  },
  {
    id: "32",
    fieldName: "客户oo",
    fieldCode: "kehuOO",
    fieldType: "java.util.Date",
    fieldEnum: "",
    calibratorType: "DATE_RANGE",
  },
];

const condition = {
  id: "12",
  objectName: "对象OBJ",
  objectCode: "DD5463",
  status: 0,
  useStatus: 0,
  updatedByName: "苏伟",
  updatedDate: "2022-03-31 10:35:46",
  ruleObjectList: rule.checkBoxData,
};

const rule = {
  schemaData: {
    type: "object",
    required: [],
    properties: {
      kehuHH: {
        type: "string",
        title: "客户hh",
      },
    },
  },
  checkBoxData: [
    {
      id: "27",
      fieldName: "客户hh",
      fieldCode: "kehuHH",
      fieldType: "java.lang.String",
      fieldEnum: "",
      calibratorType: "STRING_EQUALS",
    },
  ],
  formData: {
    kehuHH: "123",
  },
};




let sss =       [{
  conditionName: "fake_data",
  sortNo: 1,
  nextRelation: "AND",
  ruleObjectList: {
    id: "12",
    objectName: "客户",
    objectCode: "customer",
    status: 0,
    useStatus: 0,
    updatedByName: "苏伟",
    updatedDate: "2022-03-31 10:35:46",
    ruleObjectFieldList: [
      {
        id: "26",
        fieldName: "客户类型",
        fieldCode: "customer_type",
        fieldType: "java.lang.String",
        fieldEnum: "小客户;中客户;大客户",
        calibratorType: "STRING_EQUALS",
        fieldValue: "123",
      },
      {
        id: "27",
        fieldName: "客户名称",
        fieldCode: "customer_name",
        fieldType: "java.lang.String",
        fieldEnum: "",
        calibratorType: "VALUE_CONTAIN",
        fieldValue: "kkkk",
      },
    ],
  },
},
{
  conditionName: "fake_data",
  sortNo: 1,
  nextRelation: "AND",
  ruleObjectList: {
    id: "12",
    objectName: "客户",
    objectCode: "customer",
    status: 0,
    useStatus: 0,
    updatedByName: "苏伟",
    updatedDate: "2022-03-31 10:35:46",
    ruleObjectFieldList: [
      {
        id: "26",
        fieldName: "客户类型",
        fieldCode: "customer_type",
        fieldType: "java.lang.String",
        fieldEnum: "小客户;中客户;大客户",
        calibratorType: "STRING_EQUALS",
        fieldValue: "123",
      },
      {
        id: "27",
        fieldName: "客户名称",
        fieldCode: "customer_name",
        fieldType: "java.lang.String",
        fieldEnum: "",
        calibratorType: "VALUE_CONTAIN",
        fieldValue: "kkkk",
      },
    ],
  },
}]
// 规则集里的规则是and
// 规则集之间是or


// 大于等于和小于等于




let per  = [
  {
      "id": "26",
      "fieldName": "客户类型",
      "fieldCode": "customer_type",
      "fieldType": "java.lang.String",
      "fieldEnum": "小客户;中客户;大客户",
      "calibratorType": "VALUE_CONTAIN"
  },
  {
      "id": "27",
      "fieldName": "客户名称",
      "fieldCode": "customer_name",
      "fieldType": "java.lang.String",
      "fieldEnum": "",
      "calibratorType": "STRING_EQUALS"
  },
  {
      "id": "28",
      "fieldName": "客户规模",
      "fieldCode": "customer_size",
      "fieldType": "java.lang.Integer",
      "fieldEnum": "1000;2000;3000",
      "calibratorType": "VALUE_CONTAIN"
  },
  {
      "id": "29",
      "fieldName": "客户年龄",
      "fieldCode": "customer_age",
      "fieldType": "java.lang.Integer",
      "fieldEnum": "",
      "calibratorType": "INTEGER_RANGE"
  },
  {
      "id": "30",
      "fieldName": "客户市值",
      "fieldCode": "customer_market_value",
      "fieldType": "java.lang.Double",
      "fieldEnum": "",
      "calibratorType": "DOUBLE_RANGE"
  },
  {
      "id": "31",
      "fieldName": "客户员工数量",
      "fieldCode": "customer_employees_num",
      "fieldType": "java.math.BigDecimal",
      "fieldEnum": "",
      "calibratorType": "NUMBER_RANGE"
  },
  {
      "id": "32",
      "fieldName": "客户上市时期",
      "fieldCode": "customer_launch_data",
      "fieldType": "java.util.Date",
      "fieldEnum": "",
      "calibratorType": "DATE_RANGE"
  }
]

INTEGER_RANGE 整数 
DOUBLE_RANGE  支持整数 小数 
NUMBER_RANGE  是支持什么？



{
  "id": "12",
  "objectName": "客户",
  "objectCode": "customer",
  "status": 0,
  "useStatus": 1,
  "updatedByName": "苏伟",
  "updatedDate": "2022-03-31 10:35:46",
  "ruleObjectFieldResVoList": [
      {
          "id": "26",
          "fieldName": "客户类型",
          "fieldCode": "customer_type",
          "fieldType": "java.lang.String",
          "fieldEnum": "小客户;中客户;大客户"
      },
      {
          "id": "27",
          "fieldName": "客户名称",
          "fieldCode": "customer_name",
          "fieldType": "java.lang.String",
          "fieldEnum": ""
      },
      {
          "id": "28",
          "fieldName": "客户规模",
          "fieldCode": "customer_size",
          "fieldType": "java.lang.Integer",
          "fieldEnum": "1000;2000;3000"
      },
      {
          "id": "29",
          "fieldName": "客户年龄",
          "fieldCode": "customer_age",
          "fieldType": "java.lang.Integer",
          "fieldEnum": ""
      },
      {
          "id": "30",
          "fieldName": "客户市值",
          "fieldCode": "customer_market_value",
          "fieldType": "java.lang.Double",
          "fieldEnum": ""
      },
      {
          "id": "31",
          "fieldName": "客户员工数量",
          "fieldCode": "customer_employees_num",
          "fieldType": "java.math.BigDecimal",
          "fieldEnum": ""
      },
      {
          "id": "32",
          "fieldName": "客户上市时期",
          "fieldCode": "customer_launch_data",
          "fieldType": "java.util.Date",
          "fieldEnum": ""
      }
  ],
  "formData": {
      "customer_name": "1234"
  },
  "checkList": [
      "27"
  ],
  "ruleObjectFieldList": [
      {
          "id": "27",
          "fieldName": "客户名称",
          "fieldCode": "customer_name",
          "fieldType": "java.lang.String",
          "fieldEnum": "",
          "calibratorType": "STRING_EQUALS",
          "fieldValue": "1234"
      }
  ]
}




1.上面页面名称应该是 新建自定义规则   ok
2.文本框内应该保持与其他模块一致，提示可以输入多少个字符  ok 
3.添加规则页面搜索按钮无作用 ok
4.列表页100%比例的时候分页不展示
5.当对象有两个文本框代表范围时，应该支持只填写一个文本框

7.缺少模糊匹配或者精确匹配的选择条件   不支持

8、进入规则库信息编辑页面点击保存名称红字报错  ok 
9.页面100%比例的时候编辑页面展示不全
10、列表页被调用次数排序无作用，列表页规则名字字段建议修改为规则名称 
11.进入规则库编辑页面之后点击取消后规则库信息丢失，返回参数   ok
13.列表页搜索条件没有编码，应该是最后修改人   ok
14.规则编辑未添加必填标识以及前端没有先校验，点击后端报错之后完成按钮一直在刷新无法点击  ok 
15.搜索条件小叉号 ok
添加规则时对接对象管理应该是 -当前规则库内- -已经发布的对象- 才可以添加  ok



updatedByName
