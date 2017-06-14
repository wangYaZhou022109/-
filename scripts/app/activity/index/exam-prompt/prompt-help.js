var beforeExam, processExam, afterExam, isSignUpType,
    needSignUp, canExamMore, canViewDetailImmd, overExam,
    signUpExam, isInApplcantTimeRange, waitApprove, examCanceled,
    isFirstTimeToExam, overApplcantTime, hasExamed, paperProcess,
    isReset, examStarting;

// 1: 报名考试， 需要报名
// 2: 报名考试， 待审核
// 3: 报名考试， 报名通过
// 4: 考试活动还没开始
// 5: 进行考试
// 6: 可多次考，可查看上次考试成绩详情
// 7: 可查看上次考试成绩详情
// 8: 考试结束
// 9: 考试活动结束 可查看考试详情
// 10: 报名考试，超出报名时间范围
// 11: 查看证书 查看详情
// 12: 考试已撤销
// 13: 考试结束，没有详情
// 14: 可考多次 不能马上查看详情,或者 第一次答卷，进行一半关闭了页面
// 15: 报名时间截止
// 16: 答卷完，能重新考，试卷处理中
// 17: 答卷完，不能重新考，试卷处理中
exports.getUserStatusOfExam = function(exam) {
    var signUp = signUpExam(exam);

    if (examCanceled(exam)) {
        return 12;
    }

    if (beforeExam(exam.startTime)) {
        //  兼容撤销后已考过
        if (hasExamed(exam) && canViewDetailImmd(exam)) {
            return 7;
        }

        if (signUp !== 0) {
            return signUp;
        }
        return 4;
    }

    if (processExam(exam.startTime, exam.endTime) || isReset(exam)) {
        if (signUp !== 0 && signUp !== 3) {
            return signUp;
        }

        if (overExam(exam) && canExamMore(exam) && paperProcess(exam)) {
            return 16;
        } else if (overExam(exam) && canExamMore(exam) && canViewDetailImmd(exam)) {
            return 6;
        } else if (overExam(exam) && paperProcess(exam)) {
            return 17;
        } else if (overExam(exam) && canViewDetailImmd(exam)) {
            return 7;
        } else if (overExam(exam) && canExamMore(exam)) {
            return 14;
        } else if (isFirstTimeToExam(exam)) {
            if (examStarting(exam)) {
                return 14;
            }
            return 5;
        } else if (overExam(exam)) {
            return 8;
        }

        return 5;
    }

    if (afterExam(exam.endTime)) {
        if (exam.hasCert && exam.examRecord && exam.examRecord.status > 5) {
            return 11;
        }
        if (exam.examRecord && exam.examRecord.status > 5) {
            return 9;
        }
        return 13;
    }
    return 0;
};

//  开考前
beforeExam = function(startTime) {
    return new Date().getTime() < startTime;
};

processExam = function(startTime, endTime) {
    var currentTime = new Date().getTime();
    return (currentTime >= startTime && currentTime <= endTime);
};

afterExam = function(endTime) {
    return new Date().getTime() > endTime;
};

signUpExam = function(exam) {
    if (isSignUpType(exam)) {
        if (needSignUp(exam)) {
            if (isInApplcantTimeRange(exam)) {
                return 1;
            } else if (overApplcantTime(exam)) {
                return 15;
            }
            return 10;
        } else if (waitApprove(exam)) {
            return 2;
        }
        return 3;
    }
    return 0;
};

isSignUpType = function(exam) {
    return exam.needApplicant === 1 && exam.examedTimes === 0;
};

needSignUp = function(exam) {
    return !exam.signUp.id || exam.signUp.status > 2; // 已拒绝报名的记录还可以继续报名吗？
};

canExamMore = function(exam) {
    return exam.allowExamTimes > exam.examedTimes
        || exam.allowExamTimes === 0;
};

canViewDetailImmd = function(exam) {
    return ((exam.examRecord && exam.examRecord.status > 4) || exam.examRecord.submitTime)
        && exam.isShowAnswerImmed === 1;
};

overExam = function(exam) {
    return (exam.examRecord && exam.examRecord.status > 4)
        || exam.examedTimes > 0 ||
        (exam.examRecord && exam.examRecord.status < 4 && exam.examRecord.submitTime);
};

isInApplcantTimeRange = function(exam) {
    var currentTime = new Date().getTime();
    return currentTime >= exam.applicantStartTime && currentTime <= exam.applicantEndTime;
};

waitApprove = function(exam) {
    return exam.signUp && exam.signUp.status === 1 && exam.applicantNeedAudit === 1;
};

examCanceled = function(exam) {
    return exam.status === 1;
};

isFirstTimeToExam = function(exam) {
    return exam.examedTimes === 0;
};

overApplcantTime = function(exam) {
    return new Date().getTime() > exam.applicantEndTime && !exam.signUp.id;
};

hasExamed = function(exam) {
    return exam.examedTimes > 0;
};


paperProcess = function(exam) {
    return exam.examRecord
        && exam.examRecord.status < 4 && exam.examRecord.submitTime;
};

isReset = function(exam) {
    return exam.examRecord && exam.examRecord.isReset === 1;
};

examStarting = function(exam) {
    return exam.examRecord && exam.examRecord.status <= 4;
};
