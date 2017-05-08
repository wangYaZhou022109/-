var beforeExam, processExam, afterExam,
    isFinished, examAgain, viewDetail;

// 1: 考试时间没到
// 2: 考试完成
// 3: 考试没通过 重新考
// 4: 进入考试
// 5: 考试结束
// 6： 查看详情
exports.getUserStatusOfExam = function(exam) {
    if (beforeExam(exam.startTime)) {
        return 1;
    }

    if (processExam(exam.startTime, exam.endTime)) {
        if (isFinished(exam)) {
            return 2;
        }

        if (examAgain(exam)) {
            return 3;
        }

        return 4;
    }

    if (afterExam(exam.endTime)) {
        if (viewDetail(exam)) {
            return 6;
        }
        return 5;
    }
    return 0;
};

beforeExam = function(startTime) {
    return startTime && new Date().getTime() < startTime;
};

processExam = function(startTime, endTime) {
    var currentTime = new Date().getTime();
    return (startTime && endTime && currentTime >= startTime && currentTime <= endTime)
        || (!startTime && !endTime);
};

afterExam = function(endTime) {
    return endTime && new Date().getTime() > endTime;
};

isFinished = function(exam) {
    return exam.examRecord.isFinished;
};

examAgain = function(exam) {
    return exam.examRecord.isFinished === 0;
};

afterExam = function(exam) {
    return (!exam.startTime && !exam.endTime) || (exam.endTime < new Date().getTime());
};

viewDetail = function(exam) {
    return exam.examRecord && exam.examRecord.status > 4;
};
