import JSZip from 'jszip';

import { TripDayActivity } from 'src/services/trips/TripDayActivity';
import { TripDay } from 'src/services/trips/TripDay';
import { DateFormat } from 'src/config/dateFormats';

import { getMarkerNameWithFolder } from './getMarkerUrl';


export interface MarkerGroup {
    day: TripDay;
    activities: Marker[];
}

interface Marker {
    activity: TripDayActivity;
    iconUrl: string;
}

export const generateKmzAsync = async (markerGroups: MarkerGroup[]) => {
    // Fetch all icons in parallel
    const iconPromises = markerGroups.flatMap(g => g.activities).map(async ({ iconUrl }) => {
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

    markerGroups.forEach(({ day, activities }) => {
        // Add a folder for each day
        const folderElement = xmlDoc.createElement('Folder');

        // Set folder name to day's name and date
        const folderNameElement = xmlDoc.createElement('name');
        folderNameElement.textContent = `${day.date.format(DateFormat.DateWithWeekDay)}${day.name ? ` (${day.name})` : ''}`;
        folderElement.appendChild(folderNameElement);

        // Append each activity to the day's folder
        activities.forEach((marker) => {
            const [iconName, iconBlob] = iconsMap[marker.iconUrl];
            zip.file(iconName, iconBlob);

            // Create Placemark element
            const placemarkElement = xmlDoc.createElement('Placemark');

            // Name
            const nameElement = xmlDoc.createElement('name');
            nameElement.textContent = marker.activity.name;
            placemarkElement.appendChild(nameElement);

            // Description
            const descriptionElement = xmlDoc.createElement('description');
            descriptionElement.textContent = marker.activity.description;
            placemarkElement.appendChild(descriptionElement);

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

            // Append Placemark to the Folder
            folderElement.appendChild(placemarkElement);
        });

        // Append Folder to Document
        documentElement.appendChild(folderElement);
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
