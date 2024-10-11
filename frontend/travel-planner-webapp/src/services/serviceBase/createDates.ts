import moment from 'moment';


export function createDates(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(createDates);
    }

    if (typeof obj === 'object') {
        const updatedObj = { ...obj };
        for (const key in obj) {
            if (updatedObj.hasOwnProperty(key) && key.toLowerCase().endsWith('date')) {
                updatedObj[key] = moment(updatedObj[key]);
            } else {
                updatedObj[key] = createDates(updatedObj[key]);
            }
        }

        return updatedObj;
    }

    return obj;
}