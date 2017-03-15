var options = {
        sequence: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        prefix: '第',
        suffixSection: '节',
        suffixChapter: '章'
    },
    chapterOrSection = { 1: options.suffixChapter, 2: options.suffixSection },
    sectionCode = {
        1: 'pdf',
        2: 'image',
        3: 'url',
        // 4: 'scorm',
        5: 'audio',
        6: 'video',
        7: 'epub',
        // 8: 'task',
        // 9: 'exam',
        // 10: 'course',
        // 11: 'face',
        // 12: 'evaluate'
    };

exports.seqName = function(order, type) {
    return options.prefix + options.sequence[order] + chapterOrSection[type];
};

exports.sectionCode = sectionCode;

exports.judgeSection = function(sectionType) {
    var type = window.parseInt(sectionType);
    if (type === 1 || type === 3 || type === 5 || type === 6) {
        return true;
    }
    return false;
};

