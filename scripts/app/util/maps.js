var _ = require('lodash/collection');
module.exports = {
    status: {
        0: '草稿', 1: '开启中', 2: '已关闭', 3: '已发布'
    },
    'organization-level': {
        1: '管理节点', 2: '公司', 3: '分公司', 4: '部门'
    },
    'organization-status': {
        1: '正常', 2: '冻结', 3: '停用'
    },
    'menu-level': {
        1: '管理级', 2: '公司级', 3: '分公司级', 4: '部门级'
    },
    'grant-operator': {
        0: '完全控制', 1: '只读', 2: '可编辑', 3: '可删除', 4: '其他'
    },
    'menu-uri': {
        菜单管理: 'system/menu',
        角色管理: 'system/role',
        权限管理: 'system/grant',
        用户管理: 'human/member',
        组织管理: 'human/organization',
        岗位管理: 'human/position',
        职务管理: 'human/job',
        职务类别: 'human/job-type',
        人员标签: 'human/tag',
        试题管理: 'exam/question',
        试卷管理: 'exam/paper',
        考试管理: 'exam/exam',
        分类管理: 'exam/catalog'
    },
    'active-status': {
        1: '活动', 0: '禁用'
    },
    'incumbency-status': {
        1: '在职', 0: '离职'
    },
    'extention-configType': {
        1: '文本式数据', 2: '下拉列表式数据', 3: '日期型数据', 4: '时间型数据', 5: '选择器数据', 6: '数值型数据'
    },
    'extention-required': {
        0: '选填', 1: '必填'
    },
    'extention-showType': {
        0: '不显示', 1: '显示'
    },
    'customer-types': {
        0: '正式员工', 1: '临时员工'
    },
    sexs: {
        0: '男', 1: '女'
    },
    'extention-dataType': {
        1: '人员基本信息', 2: '组织基本信息', 3: '班级基本信息', 4: '课程基本信息'
    },
    'extention-linked-choose': {
        1: '岗位选择器', 2: '人员选择器', 3: '组织选择器'
    },
    'extention-number-norm': {
        1: '正整数', 2: '正数，支持保留小数点后两位'
    },
    'question-depot-state': {
        0: '禁用', 1: '活动'
    },
    'question-types': {
        1: '单选', 2: '多选', 3: '判断', 4: '填空', 5: '问答', 6: '阅读理解', 7: '连线', 8: '排序'
    },
    'question-difficultys': {
        1: '高', 2: '中', 3: '低'
    },
    'exam-type': {
        0: '全部', 1: '报名考试', 2: '指定考生', 3: '考试练习'
    },
    'exam-status': {
        1: '未发布', 2: '已发布', 3: '报名中', 4: '已结束', 5: '开考中', 6: '审核中', 7: '被拒绝'
    },
    'publish-status': {
        0: '未发布', 1: '已发布'
    },
    'yes-or-no': {
        0: '否', 1: '是'
    }
};

module.exports.get = function(k) {
    var arr = [];
    _.forEach(this[k], function(value, key) {
        arr.push({ key: key, value: value });
    });
    return arr;
};
