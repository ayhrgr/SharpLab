import type { AppOptions } from '../types/app';
import toRawOptions from '../helpers/to-raw-options';
import warn from '../helpers/warn';
import type { Gist } from '../../app/features/save-as-gist/Gist';
import { CacheKeyData, loadResultFromCacheAsync } from '../../app/features/result-cache/cacheLogic';
import type { CachedUpdateResult } from '../../app/features/result-cache/types';
import type { Branch } from '../../app/shared/types/Branch';
import defaults from './handlers/defaults';
import lastUsed from './handlers/last-used';
import { saveStateToUrl, loadStateFromUrlAsync } from './handlers/url';

export type AppStateData = {
    options: AppOptions;
    code: string;
    gist: Gist | null;
};

export const saveState = (state: AppStateData) => {
    const { code, options, gist } = state;
    const rawOptions = toRawOptions(options);

    lastUsed.saveOptions(rawOptions);
    const { keepGist } = saveStateToUrl(code, rawOptions, { gist });
    if (!keepGist)
        state.gist = null;
};

const loadResultFromCacheSafeAsync = async (cacheKey: CacheKeyData) => {
    try {
        return await loadResultFromCacheAsync(cacheKey);
    }
    catch (e) {
        warn('Failed to load cached result: ', e);
        return null;
    }
};

export const loadStateAsync = async (
    state: Partial<AppStateData>,
    {
        resolveBranchAsync,
        setResultFromCache
    }: {
        resolveBranchAsync: (id: string) => Promise<Branch|null>;
        setResultFromCache: (result: CachedUpdateResult, options: AppOptions) => void;
    }
) => {
    const fromUrl = await loadStateFromUrlAsync();
    const lastUsedOptions = lastUsed.loadOptions();

    const loadedOptions = fromUrl?.options ?? lastUsedOptions ?? {};
    const defaultOptions = defaults.getOptions();

    const language = loadedOptions.language ?? defaultOptions.language;
    const target = loadedOptions.target ?? defaultOptions.target;
    const release = loadedOptions.release ?? defaultOptions.release;
    let branchId = loadedOptions.branchId ?? null;
    if (branchId === 'master')
        branchId = 'main';

    const branch = branchId ? (await resolveBranchAsync(branchId)) : null;
    const options = { language, target, release, branch };

    const code = fromUrl?.code ?? defaults.getCode(language, target);

    state.options = options;
    state.code = code;
    state.gist = fromUrl && ('gist' in fromUrl)
        ? fromUrl.gist
        : null;

    const cachedResult = await loadResultFromCacheSafeAsync({
        language,
        target,
        release,
        branchId,
        code
    });
    if (cachedResult)
        setResultFromCache(cachedResult, options);
    if (lastUsedOptions && !fromUrl?.options) // need to re-sync implicit options into URL
        saveStateToUrl(fromUrl?.code, toRawOptions(options));
};