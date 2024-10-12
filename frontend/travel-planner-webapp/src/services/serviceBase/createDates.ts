import moment from 'moment';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDates(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(createDates);
    }

    if (!!obj && typeof obj === 'object') {
        const updatedObj = { ...obj };
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(updatedObj, key) && key.toLowerCase().endsWith('date')) {
                updatedObj[key] = moment(updatedObj[key]);
            } else {
                updatedObj[key] = createDates(updatedObj[key]);
            }
        }

        return updatedObj;
    }

    return obj;
}