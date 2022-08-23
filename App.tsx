import React from 'react';
import { RecoilRoot } from 'recoil';

import AppInner from './AppInner';

function App() {
  return (
    <RecoilRoot>
      <AppInner />
    </RecoilRoot>
  );
}

export default App;
