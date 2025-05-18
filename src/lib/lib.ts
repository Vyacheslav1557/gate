function numberToLetters(num: number): string {
    if (num <= 0) {
        return '';
    }

    let result = '';
    while (num > 0) {
        const remainder = (num - 1) % 26;
        const charCode = remainder + 65;
        result = String.fromCharCode(charCode) + result;
        num = Math.floor((num - 1) / 26);
    }

    return result;
}

function ProblemTitle(position: number, title: string): string {
    return `${numberToLetters(position)}. ${title}`;
}

enum State {
    Saved = 1, // saved to db

    GotCE = 101, // compilation error
    GotTL = 102, // time limit exceeded
    GotML = 103, // memory limit exceeded
    GotRE = 104, // runtime error
    GotPE = 105, // presentation error
    GotWA = 106, // wrong answer

    Accepted = 200, // accepted
}

function StateString(state: number): string {
    if (state === State.Saved) {
        return "QD"; // Queued/Saved
    }
    if (state === State.GotCE) {
        return "CE"; // Compilation Error
    }
    if (state === State.GotTL) {
        return "TL"; // Time Limit Exceeded
    }
    if (state === State.GotML) {
        return "ML"; // Memory Limit Exceeded
    }
    if (state === State.GotRE) {
        return "RE"; // Runtime Error
    }
    if (state === State.GotPE) {
        return "PE"; // Presentation Error
    }
    if (state === State.GotWA) {
        return "WA"; // Wrong Answer
    }
    if (state === State.Accepted) {
        return "AC"; // Accepted
    }

    return "UK"; // Default case for unrecognized states
}

function StateColor(state: number): string {
    if (state === State.Saved) {
        return "#b1b1b1"; // Queued/Saved
    }
    if (state === State.Accepted) {
        return "#00ff00"; // Accepted
    }

    const kal = [
        State.GotCE,
        State.GotTL,
        State.GotML,
        State.GotRE,
        State.GotPE,
        State.GotWA
    ];

    if (kal.findIndex((x) => x === state) !== -1) {
        return "#ff0000";
    }

    return "#FFCF48";
}

enum LanguageName {
    Golang = 10,
    Cpp = 20,
    Python = 30,
}

function LangString(language: number): string {
    if (language === LanguageName.Golang) {
        return "Golang";
    }
    if (language === LanguageName.Cpp) {
        return "C++";
    }
    if (language === LanguageName.Python) {
        return "Python";
    }
    return "Unknown"; // Default case for unrecognized languages
}

function TimeBeautify(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function LangNameToString(language: number): string {
    if (language === LanguageName.Golang) {
        return "go";
    }
    if (language === LanguageName.Cpp) {
        return "cpp";
    }
    if (language === LanguageName.Python) {
        return "python";
    }
    return "unknown";
}

export {
    numberToLetters,
    StateString,
    LangString,
    StateColor,
    LanguageName,
    ProblemTitle,
    TimeBeautify,
    LangNameToString
};