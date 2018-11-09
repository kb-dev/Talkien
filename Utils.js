import moment from 'moment';

function upperCaseFirstLetter(string) {
    const firstLetter = string[0].toUpperCase();
    return firstLetter + string.substr(1);
}

/**
 *
 * @param a {array}
 * @param b {array}
 * @return boolean
 */
function isArraysEquals(a, b) {
    if (a.length !== b.length) {
        return false;
    } else {
        const iMax = a.length;
        let i = 0;
        for (; i < iMax; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalize(string) {
    let words = string.split(' ');
    words = words.map((word) => capitalizeFirstLetter(word));
    return words.join(' ');
}

function cleanMarkdown(string) {
    const boldRegex = new RegExp('[*]{2}(.*)[*]{2}', 'gim');
    const italicRegex = new RegExp('_(.*)_', 'gim');
    const linkRegex = new RegExp('(?:__|[*#])|\\[(.*?)\\]\\(.*?\\)', 'gim');
    return string
        .replace(linkRegex, '$1')
        .replace(italicRegex, '$1')
        .replace(boldRegex, '$1');
}

function generateChecksum(eventId, startDate, endDate, location, name) {
    return `${eventId}|${startDate}-${endDate}@${location}#${name}`;
}

function compareDate(a, b) {
    let momentA = a;
    let momentB = b;

    if (typeof a === 'string') {
        momentA = moment(a);
    }
    if (typeof b === 'string') {
        momentB = moment(b);
    }

    if (momentA.isBefore(momentB)) {
        return -1;
    } else if (momentA.isAfter(momentB)) {
        return 1;
    }
    return 0;
}

export { compareDate, upperCaseFirstLetter, isArraysEquals, capitalize, capitalizeFirstLetter, cleanMarkdown, generateChecksum };
