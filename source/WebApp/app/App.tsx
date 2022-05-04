import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { Footer } from './Footer';
import { Main } from './Main';
import { AppStateManager } from './main/AppStateManager';

export const App: FC = () => {
    return <RecoilRoot>
        <AppStateManager>
            <Main />
            <Footer />
        </AppStateManager>
    </RecoilRoot>;
};