import { getColorByIndex } from './markerColors';


const getMarkerBaseUrl = (path: string) => `${window.location.origin}/images/markers/${path}.png`;

const getMarkerWithColorUrl = (colorIndex: number, fileName: string) => getMarkerBaseUrl(`${getColorByIndex(colorIndex)}/${fileName}`);

export const getEmptyMarkerUrl = (colorIndex: number) => getMarkerWithColorUrl(colorIndex, 'empty');

export const getAccomodationMarkerUrl = () => getMarkerBaseUrl('red/bed');

export const getMarkerUrl = (colorIndex: number, index: number) => {
    return index < 98 ? getMarkerWithColorUrl(colorIndex, `number-${index + 1}`) : getEmptyMarkerUrl(colorIndex);
};


export const getMarkerNameWithFolder = (url: string) => url.split('/').slice(-2).join('/');