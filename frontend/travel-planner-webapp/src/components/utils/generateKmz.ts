import JSZip from 'jszip';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';

import { getMarkerNameWithFolder } from './getMarkerUrl';


interface Marker {
    activity: TripDayActivity;
    iconUrl: string;
}

export const generateKmzAsync = async (markers: Marker[]) => {
    // Fetch all icons in parallel
    const iconPromises = markers.map(async ({ iconUrl }) => {
        const iconName = getMarkerNameWithFolder(iconUrl) || '';
        const iconBlob = await fetch(iconUrl).then((res) => res.blob());

        return { iconUrl, iconName, iconBlob };
    });
    const icons = await Promise.all(iconPromises);

    const iconsMap = icons.reduce((acc, { iconUrl, iconName, iconBlob }) => {
        acc[iconUrl] = [iconName, iconBlob];
        return acc;
    }, {} as Record<string, [string, Blob]>);

    const zip = new JSZip();
    const xmlDoc = document.implementation.createDocument(null, 'kml', null);

    // Create KML root element and set namespace
    const kmlElement = xmlDoc.documentElement;
    kmlElement.setAttribute('xmlns', 'http://www.opengis.net/kml/2.2');

    // Create Document element
    const documentElement = xmlDoc.createElement('Document');
    kmlElement.appendChild(documentElement);

    markers.forEach(async (marker) => {
        const [iconName, iconBlob] = iconsMap[marker.iconUrl];
        zip.file(iconName, iconBlob);

        // Create Placemark element
        const placemarkElement = xmlDoc.createElement('Placemark');

        // Name
        const nameElement = xmlDoc.createElement('name');
        nameElement.textContent = marker.activity.name;
        placemarkElement.appendChild(nameElement);

        // Point
        const pointElement = xmlDoc.createElement('Point');
        const coordinatesElement = xmlDoc.createElement('coordinates');
        coordinatesElement.textContent = `${marker.activity.longitude},${marker.activity.latitude}`;
        pointElement.appendChild(coordinatesElement);
        placemarkElement.appendChild(pointElement);

        // Style with Icon
        const styleElement = xmlDoc.createElement('Style');
        const iconStyleElement = xmlDoc.createElement('IconStyle');
        const iconElement = xmlDoc.createElement('Icon');
        const hrefElement = xmlDoc.createElement('href');
        hrefElement.textContent = iconName;
        iconElement.appendChild(hrefElement);
        iconStyleElement.appendChild(iconElement);
        styleElement.appendChild(iconStyleElement);
        placemarkElement.appendChild(styleElement);

        // Append Placemark to Document
        documentElement.appendChild(placemarkElement);
    });

    // Serialize XML to string
    const serializer = new XMLSerializer();
    const kmlContent = serializer.serializeToString(xmlDoc);

    // Add KML file to KMZ archive
    zip.file('doc.kml', kmlContent);

    // Generate the KMZ (zip) file
    const kmzBlob = await zip.generateAsync({ type: 'blob' });

    return new Blob([kmzBlob], { type: 'application/vnd.google-earth.kmz' });
};
