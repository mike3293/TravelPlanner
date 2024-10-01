type Unmutable<Type> = {
    readonly [Property in keyof Type]: Type[Property];
};

const constants = {
    VECTOR_MAP_STYLE_URL: process.env.REACT_APP_MAP_STYLE_URL!,
    VECTOR_MAP_ATTRIBUTION:
        "\u003ca href='https://www.maptiler.com/copyright/' target='_blank' \u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    FALLBACK_MAP_LAYER_URL: process.env.REACT_APP_FALLBACK_MAP_URL!,
    FALLBACK_MAP_ATTRIBUTION:
        "\u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    API_URL: process.env.REACT_APP_API_URL!,
    GEOCODER_API_URL: process.env.REACT_APP_GEOCODER_API_URL!,
};

console.log('Config check');
for (const [key, value] of Object.entries(constants)) {
    if (!value) throw new Error(`Missing ${key} config setting`);
}

type ConstantsType = Unmutable<typeof constants>;

export default constants as ConstantsType;
