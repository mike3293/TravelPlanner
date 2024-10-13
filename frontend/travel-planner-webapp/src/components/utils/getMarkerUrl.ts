import { getColorByIndex } from './markerColors';


export const getMarkerBaseUrl = (colorIndex: number, fileName: string) => `${window.location.origin}/images/markers/${getColorByIndex(colorIndex)}/${fileName}.png`;

export const getEmptyMarkerUrl = (colorIndex: number) => getMarkerBaseUrl(colorIndex, 'empty');

export const getMarkerUrl = (colorIndex: number, index: number) => {
    return index < 98 ? getMarkerBaseUrl(colorIndex, `number-${index + 1}`) : getEmptyMarkerUrl(colorIndex);
};


export const getMarkerNameWithFolder = (url: string) => url.split('/').slice(-2).join('/');