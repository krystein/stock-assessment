export const content = ["./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
    extend: {
        animation: {
            marquee: "marquee 30s linear infinite",
        },
        keyframes: {
            marquee: {
                "0%": { transform: "translateX(0%)" },
                "100%": { transform: "translateX(-50%)" },
            },
        },
    },
};
export const plugins = [];
