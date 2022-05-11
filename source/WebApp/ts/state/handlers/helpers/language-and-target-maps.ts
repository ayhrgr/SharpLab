import { targets } from '../../../helpers/targets';
import mapObject from '../../../helpers/map-object';
import asLookup from '../../../helpers/as-lookup';
import { assertType } from '../../../helpers/assert-type';
import { LanguageName, LANGUAGE_CSHARP, LANGUAGE_FSHARP, LANGUAGE_IL, LANGUAGE_VB } from '../../../../app/shared/languages';

function reverseMap<TMap extends { [key: string]: string }>(map: TMap) {
    type KeyFromValue<T, V> = { [K in keyof T]: V extends T[K] ? K : never }[keyof T];
    return mapObject(map, (key, value) => [value, key]) as {
        [TValue in TMap[keyof TMap]]: KeyFromValue<TMap, TValue>
    };
}

const languageMap = {
    [LANGUAGE_CSHARP]: 'cs',
    [LANGUAGE_VB]:     'vb',
    [LANGUAGE_FSHARP]: 'fs',
    [LANGUAGE_IL]:     'il'
} as const;
assertType<{ [K in LanguageName]: string }>(languageMap);

const languageMapReverse = reverseMap(languageMap);

const languageMapAsLookup = asLookup(languageMap);
const languageMapReverseAsLookup = asLookup(languageMapReverse);
export {
    languageMapAsLookup as languageMap,
    languageMapReverseAsLookup as languageMapReverse
};

const targetMap = {
    [targets.csharp]:  languageMap[LANGUAGE_CSHARP],
    [targets.vb]:      languageMap[LANGUAGE_VB],
    [targets.il]:      'il',
    [targets.asm]:     'asm',
    [targets.ast]:     'ast',
    [targets.run]:     'run',
    [targets.verify]:  'verify',
    [targets.explain]: 'explain'
} as const;
assertType<{ [K in typeof targets[keyof typeof targets]]: string }>(targetMap);

const targetMapReverse = reverseMap(targetMap);
const targetMapAsLookup = asLookup(targetMap);
const targetMapReverseAsLookup = asLookup(targetMapReverse);
export {
    targetMapAsLookup as targetMap,
    targetMapReverseAsLookup as targetMapReverse
};

export const targetMapReverseV1 = mapObject(targetMapReverseAsLookup, (key, value) => ['>' + key, value]); // eslint-disable-line prefer-template