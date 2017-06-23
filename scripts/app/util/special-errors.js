var codes = [
    30117,
    30126,
    40205,
    40206,
    40901,
    40902,
    40308, // 直播未发布
    40309, // 无权限参加直播
    40305, // 直播参与人数超过计划人数
    30520, // 调研未发布
    30521 // 无权限参加调研
];

exports.hasCode = function(code) {
    return codes.join(',').indexOf(code) > -1;
};
