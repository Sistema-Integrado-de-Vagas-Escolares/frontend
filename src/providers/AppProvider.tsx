'use client';

import { HydrationProvider } from './HydrationProvider';

const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  return <HydrationProvider>{children}</HydrationProvider>;
};

export default AppProvider;
