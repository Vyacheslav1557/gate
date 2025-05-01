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

export {numberToLetters};