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