exports.title = '待办';

exports.items = {
    label: 'label',
    content: 'content',
    satisfaction: '', // 满意度评估
    evaluation: '', // 考试评卷
    homework: '' // 作业批阅
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '满意度评估', url: 'satisfaction', current: true },
            { id: '1', name: '考试评卷', url: 'evaluation' },
            { id: '2', name: '作业批阅', url: 'homework' }
        ] },
        state: {
            data: {
                menu: 'satisfaction', // 记录当前菜单
            }
        },
        finishStatus: {
            data: {
                value: '0', // 完成状态
            }
        }
    }
};
