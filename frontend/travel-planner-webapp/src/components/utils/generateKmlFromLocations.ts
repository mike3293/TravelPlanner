export const generateKMLWithDOM = (locations: { name: string, lat: number, lng: number }[]) => {
    const xmlDoc = document.implementation.createDocument(null, 'kml', null);
    const kmlElement = xmlDoc.documentElement;
    kmlElement.setAttribute('xmlns', 'http://www.opengis.net/kml/2.2');

    const documentElement = xmlDoc.createElement('Document');
    kmlElement.appendChild(documentElement);

    locations.forEach((location) => {
        const placemark = xmlDoc.createElement('Placemark');

        const nameElement = xmlDoc.createElement('name');
        nameElement.textContent = location.name;
        placemark.appendChild(nameElement);

        const pointElement = xmlDoc.createElement('Point');
        const coordinatesElement = xmlDoc.createElement('coordinates');
        coordinatesElement.textContent = `${location.lng},${location.lat},0`;
        pointElement.appendChild(coordinatesElement);

        placemark.appendChild(pointElement);
        documentElement.appendChild(placemark);
    });

    const serializer = new XMLSerializer();
    const kmlString = serializer.serializeToString(xmlDoc);

    return kmlString;
};