import moment from 'moment';

export function createDates(obj: any): any {
    const updatedObj = { ...obj };
    for (const key in obj) {
        if (updatedObj.hasOwnProperty(key) && key.endsWith('Date')) {
            updatedObj[key] = moment(updatedObj[key]);
        }
    }

    return updatedObj;
}