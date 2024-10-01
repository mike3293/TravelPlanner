import { Theme, useMediaQuery, UseMediaQueryOptions } from "@mui/material";

export const useSmallMobile = (options?: UseMediaQueryOptions) =>
    useMediaQuery<Theme>((theme) => theme.breakpoints.down("xs"), options);

export const useMobile = (options?: UseMediaQueryOptions) =>
    useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"), options);
