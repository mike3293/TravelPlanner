import { getColorByIndex } from './markerColors';


export const getMarkerUrl = (colorIndex: number, fileName: string) => `${window.location.origin}/images/markers/${getColorByIndex(colorIndex)}/${fileName}.png`;

export const getMarkerNameWithFolder = (url: string) => url.split('/').slice(-2).join('/');