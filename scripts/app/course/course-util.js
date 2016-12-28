var options = {
        sequence: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        prefix: '第',
        suffixSection: '节',
        suffixChapter: '章'
    },
    chapterOrSection = { 1: options.suffixChapter, 2: options.suffixSection };

exports.seqName = function(order, type) {
    return options.prefix + options.sequence[order] + chapterOrSection[type];
};

