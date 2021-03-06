var _ = require('lodash/collection');
module.exports = {
    status: {
        0: '草稿', 1: '开启中', 2: '已关闭', 3: '已发布'
    },
    'organization-level': {
        1: '管理节点', 2: '公司', 3: '分公司', 4: '部门'
    },
    'organization-status': {
        1: '可用', 2: '禁用'
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
        消息推送: 'system/msg',
        用户管理: 'human/member',
        组织管理: 'human/organization',
        岗位管理: 'human/position',
        职务管理: 'human/job',
        职务类别: 'human/job-type',
        人员标签: 'human/tag',
        试题管理: 'exam/question',
        试卷管理: 'exam/paper',
        考试管理: 'exam/exam',
        分类管理: 'exam/catalog',
        课程管理: 'course-study/course-info',
        学习推送: 'course-study/study-push',
        评卷管理: 'exam/mark-paper-manage',
        学习专题: 'course-study/subject-info',
        指定考试: 'exam/specified-exam',
        报名考试: 'front/signup',
        监控管理: 'monitor/routes'
    },
    'active-status': {
        1: '可用', 0: '禁用'
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
        0: '禁用', 1: '可用'
    },
    'question-types': {
        1: '单选', 2: '多选', 3: '判断', 4: '填空', 5: '问答', 6: '阅读理解', 8: '排序'
    },
    'question-difficultys': {
        1: '高', 2: '中', 3: '低'
    },
    'exam-type': {
        0: '全部', 1: '正式考试', 2: '非正式考试'
    },
    'exam-status': {
        1: '未发布', 2: '发布中', 3: '未开始', 4: '报名中', 5: '开考中', 6: '已结束'
    },
    'publish-status': {
        0: '未发布', 1: '已发布'
    },
    'yes-or-no': {
        0: '否', 1: '是'
    },
    'activity-type': {
        1: '班级', 2: '直播', 3: '考试', 4: '调研', 5: 'mooc'
    },
    'section-type': {
        0: '混合',
        1: '文档',
        2: '图文',
        3: 'URL',
        4: 'scrom',
        5: '音频',
        6: '视频',
        7: 'EPUB电子书',
        8: '作业',
        9: '考试',
        10: '课程',
        11: '面授',
        12: '调研',
        13: '评估',
        14: '直播'
    },
    'course-study-status': {
        0: '开始学习', 1: '继续学习', 2: '重新学习', 4: '标记完成', 5: '待审核', 6: '审核未通过'
    },
    judgement: {
        0: '错误', 2: '正确'
    },
    'subject-status': {
        0: '草稿', 1: '已上架', 2: '已下架', 3: '审核中', 4: '已拒绝'
    },
    'study-order': {
        0: '按照阶段顺序学习', 1: '按照元素顺序学习'
    },
    'signup-status': {
        0: '全部', 1: '待审核', 2: '已通过', 3: '被拒绝', 4: '未通过'
    },
    'subject-stage-element-type': {
        1: '在线课程', 2: '面授课程', 3: '在线考试', 4: '任务'
    },
    'is-required': {
        0: '选修', 1: '必修'
    },
    'exam-record-status': {
        0: '全部', 1: '未开始', 2: '进行中', 4: '异常', 5: '待评卷', 6: '及格', 7: '不及格'
    },
    'exam-room-status': {
        0: '全部', 1: '未发布', 2: '已发布', 3: '开考中', 4: '已结束'
    },
    'audience-item': {
        1: '部门', 3: '职务', 4: '岗位', 5: '人员', 6: '人员标签'
    },
    'mark-type': {
        1: '试卷', 2: '题型', 3: '试题'
    },
    'course-info-status': {
        0: '草稿', 1: '已上架', 2: '已下架', 3: '审核中', 4: '已拒绝'
    },
    'study-push-status': {
        0: '全部', 1: '草稿', 2: '推送中', 3: '暂停中', 4: '已完成'
    },
    'course-info-source': {
        0: '自建', 1: '云课程', 2: '微课大赛'
    },
    'course-info-study-status': {   // 学习状态
        0: '未开始', 1: '学习中', 2: '已完成', 3: '已放弃', 4: '已完成', 5: '待审核', 6: '审核未通过'
    },
    'course-register-type': {
        1: '自主注册', 2: '学习推送', 3: '岗位推送', 4: '群组推送', 5: '班级', 6: '学习专题'
    },
    'paper-view-type': {
        0: '一页一题', 1: '一页多题'
    },
    'push-business-type': {
        1: '课程', 2: '专题'
    },
    'app-type': {
        0: '消费者', 1: '提供者', 2: '消费者&提供者'
    },
    'provider-dynamic': {
        true: '动态', false: '静态'
    },
    'provider-enabled': {
        true: '已启用', false: '已禁用'
    },
    'override-enabled': {
        true: '已启用', false: '已禁用'
    },
    'route-enabled': {
        true: '已启用', false: '已禁用'
    },
    'route-type': {
        condition: '条件类型', script: '脚本类型'
    },
    'credential-type': {
        1: '身份证', 2: '驾驶证'
    },
    'push-record-status': {
        1: '未开始', 2: '成功', 3: '失败'
    },
    'push-record-task-status': {
        1: '未开始', 2: '进行中', 3: '已完成'
    },
    'exam-type-desc': {
        1: '( 报名范围内的用户拥有该考试的报名权限 )', 2: '( 指定对象内的用户才能参加该考试 )'
    },
    'study-config-business-type': {
        1: '课程', 2: '专题', 3: '考试'
    },
    'link-types': {
        0: '内部广告', 1: '外部广告'
    },
    'msg-publish-type': {
        0: '站内消息', 1: '邮件', 2: 'APP', 3: '短信'
    },
    'msg-publish-status': {
        0: '草稿', 1: '发布中', 2: '发布成功', 3: '发布失败'
    },
    'pdf-scale': {
        auto: '自动缩放',
        'page-actual': '实际大小',
        'page-fit': '适合页面',
        'page-width': '适合页宽',
        50: '50%',
        75: '75%',
        100: '100%',
        125: '125%',
        150: '150%',
        200: '200%',
        300: '300%',
        400: '400%'
    },
    'home-activity-type': {
        1: '班级',
        2: '直播',
        3: '考试',
        4: '调研',
        5: 'mooc'
    },
    'ask-audit-type': {
        1: '提问审核', 2: '讨论审核', 4: '提问举报审核', 5: '讨论举报审核', 12: '文章审核', 13: '文章举报审核',
    },
    'ask-audit-status': {
        0: '待审核', 1: '已通过', 2: '已拒绝'
    },
    'ask-report-type': {
        1: '问吧', 2: '知识', 3: '课程', 4: '学习'
    },
    'ask-source-type': {
        1: '违反法律', 2: '内容不准确', 3: '垃圾信息', 4: '其他'
    },
    'research-question-types': {
        1: '单选', 2: '多选', 5: '问答'
    },
    'evaluate-question-types': {
        1: '单选', 5: '问答'
    },
    chineseNumber: {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二',
        13: '十三',
        14: '十四',
        15: '十五',
        16: '十六',
        17: '十七',
        18: '十八',
        19: '十九',
        20: '二十'
    },
    'trainee-auditStatus': {
        0: '待审核', 1: '已通过', 2: '已拒绝'
    },
    'trainee-response-auditStatus': {
        0: '待审核', 1: '已通过'
    },
    'trainee-show-auditStatus': {
        0: '待审核', 1: '-'
    },
    'trainee-commit-questionary': {
        0: '未提交', 1: '已提交'
    },
    'project-approval-result': {
        1: '待预定', 2: '待审核', 3: '已审核', 4: '已审核', 5: '已审核'
    },
    'project-address': {
        1: '移动学院', 2: '南方基地'
    },
    'class-classroom': {
        0: '暂不分配', 1: '红枫叶温泉酒店', 2: '东方文化'
    },
    'display-rule': {
        0: '显示全部', 1: '显示前10名'
    },
    'class-table-type': {
        1: '其他', 2: '圆形'
    },
    'classinfo-status': {
        1: '未实施', 2: '实施中', 3: '已实施'
    },
    'class-offline-type': {
        1: '面授', 2: '录像', 3: '直播', 4: '其他'
    },
    'class-online-type': {
        1: '在线课程', 2: '知识'
    },
    'class-questionnaire-type': {
        1: '考试', 2: '调研', 3: '评估', 4: '学员满意度评估', 5: '需求方满意度评估'
    },
    'class-file-type': {
        1: '文档', 2: '压缩文件', 3: '音频', 4: '视频', 5: '电子书'
    },
    'lecturer-type': {
        0: '内部', 1: '外部'
    },
    'train-signdetail-state': {
        1: '正常', 2: '迟到', 3: '未签到', 4: '请假'
    },
    'train-bus-state': {
        0: '未开始', 1: '进行中', 2: '已结束'
    },
    'train-sign-state': {
        0: '未开始', 1: '已开始'
    },
    'compatible-client': {
        0: '全部', 1: 'PC', 2: 'APP'
    },
    'trainee-sex': {
        0: '男', 1: '女'
    },
    'research-record': {
        0: '未参与', 1: '已完成'
    },
    'course-list-company-type': {
        0: '全部', 1: '集团', 2: '本公司', 3: '其他公司'
    },
    'train-leave-state': {
        0: '待审核', 1: '同意', 2: '不同意'
    },
    'questionnaire-type': {
        1: '考试', 2: '调研', 3: '评估', 4: '学员满意度评估', 5: '需求方满意度评估'
    },
    'questin-type': { // '问题类型
        1: '问题', 2: '分享', 3: '班级讨论'
    },
    'certificate-type': { // 证书类型：
        1: '课程', 2: '专题', 3: '培训班级', 4: '考试', 5: '直播', 6: '讲师', 7: '专家', 8: '认证'
    },
    'gensee-status': { // 直播状态-直播详情用
        0: '未发布', 1: '未开始', 2: '进行中', 3: '已结束', 4: '已撤销'
    },
    'gensee-status-center': { // 直播状态-我的直播用
        0: '未发布', 1: '待开始', 2: '直播中', 3: '已结束', 4: '已撤销'
    },
    'gensee-status-archives': { // 直播状态-我的档案用
        0: '未发布', 1: '未开始', 2: '直播中', 3: '已结束', 4: '已撤销'
    },
    'knowledge-audit-status': { // 知识审核状态
        0: '待审核', 1: '已通过', 2: '已拒绝'
    },
    'research-record-status': {
        0: '未参与', 1: '已完成'
    },
    'exam-type-simple': {
        1: '正式', 2: '非正式'
    },
    'live-status': {
        1: '待开始', 2: '直播中', 3: '已结束'
    },
    'exam-source-type': {
        1: '考试活动', 2: '在线课程', 3: '专题', 4: '班级', 5: '直播'
    },
    'research-activity-status': {
        1: '未发布', 2: '未开始', 3: '进行中', 4: '已结束', 5: '已撤销'
    },
    'home-data-type': {
        1: '班级',
        2: '直播',
        3: '考试',
        4: '调研',
        5: 'mooc',
        6: '未知',
        7: '未知',
        8: '未知',
        9: '课程',
        10: '专题'
    },
    'home-default-image': {
        1: 'images/default-cover/default_class.jpg',
        2: 'images/default-cover/default_live.jpg',
        3: 'images/default-cover/default_exam.jpg',
        4: 'images/default-cover/default_survey.jpg',
        5: 'mooc',
        6: 'unknow',
        7: 'unknow',
        8: 'unknow',
        9: 'images/default-cover/default_course.jpg',
        10: 'images/default-cover/default_spceial.jpg'
    },
    'home-data-url': {
        1: '#',
        2: '/#/activity/gensee/detail/',
        3: '/#/exam/exam/answer-paper/',
        4: '/#/exam/research-activity/index/',
        5: '#',
        6: '#',
        7: '#',
        8: '#',
        9: '/#/study/course/detail/',
        10: '/#/study/subject/detail/'
    },
    'research-person-center-status': {
        1: '待开始', 2: '待参加', 3: '已完成'
    },
    'exam-person-center-status': {
        1: '待考试', 2: '待开始', 3: '待审核', 4: '待评卷', 5: '已完成'
    },
    'train-project-status': {
        1: '未实施', 2: '进行中', 3: '已结束'
    },
    'my-task-status': {
        1: '未完成', 2: '未开始'
    },
    'search-type': { // 全文搜索类型
        0: '全部',
        1: '课程',
        2: '专题',
        // 3: '慕课',
        // 4: '班级',
        5: '考试',
        6: '调研',
        7: '直播',
        8: '问题',
        9: '文章',
        10: '专家',
        11: '话题',
        12: '知识'
    },
    'gensee-access-status': { // 直播状态
        1: '已参加', 2: '待开始', 3: '未参加'
    },
    'push-object-progress-status': {
        0: '未完成', 1: '学习中', 2: '已完成', 3: '未完成', 4: '已完成'
    },
    'audit-pass': {
        1: '通过', 2: '打回重新提交'
    },
    get: function(k) {
        return _.map(this[k], function(value, key) {
            return { key: key, value: value };
        });
    },
    getValue: function(str, key) {
        if (this[str]) return this[str][key] || '';
        return '';
    }
};
