export const devMode = 'development';

export const prodMode = 'production';

import pkg from '../../package.json';

export function getCommonStoragePrefix() {
    const VITE_GLOB_APP_SHORT_NAME = "QuantF";
    return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

export function getStorageShortName() {
    return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getEnv(): string {
    return import.meta.env.MODE;
}

export function isDevMode(): boolean {
    return import.meta.env.DEV;
}

export function isProdMode(): boolean {
    return import.meta.env.PROD;
}
