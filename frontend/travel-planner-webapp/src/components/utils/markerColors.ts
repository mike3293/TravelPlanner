export enum MarkerColor {
    Purple = 'purple',
    Amber = 'amber',
    Teal = 'teal',
    Green = 'green',
    Indigo = 'indigo',
}

export const getColorByIndex = (index: number): MarkerColor => {
    switch (index % 5) {
        case 0:
            return MarkerColor.Purple;
        case 1:
            return MarkerColor.Amber;
        case 2:
            return MarkerColor.Teal;
        case 3:
            return MarkerColor.Green;
        default:
        case 4:
            return MarkerColor.Indigo;
    }
}