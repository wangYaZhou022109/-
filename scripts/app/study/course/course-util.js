var options = {
        chnNumChar: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
        chnUnitChar: ['', '十', '百', '千'],
        prefix: '第',
        suffixChapter: '章',
        suffixSection: '节'
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

var numberToChinese = function(number) {
    var num = number,
        resetStr = [],
        unitPos = 0,
        v;
    if (number > 9999) return number;
    while (num > 0) {
        v = num % 10;
        resetStr.unshift(options.chnUnitChar[unitPos++]);
        resetStr.unshift(options.chnNumChar[v]);
        num = Math.floor(num / 10);
    }
    return resetStr.join('')
    .replace(/^一十/, '十')
    .replace(/零$/, '')
    .replace(/零./g, '零')
    .replace(/零+/, '零');
};

exports.seqName = function(order, type) {
    return options.prefix + numberToChinese(order) + chapterOrSection[type];
};

exports.sectionCode = sectionCode;

exports.judgeSection = function(sectionType) {
    var type = window.parseInt(sectionType);
    var innerType = [8, 9, 12, 13];
    return innerType.indexOf(type) === -1;
};
