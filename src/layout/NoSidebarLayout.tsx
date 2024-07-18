import React, { ReactNode } from 'react';

interface NoSidebarLayoutProps {
  children: ReactNode;
}

const NoSidebarLayout: React.FC<NoSidebarLayoutProps> = ({ children }) => {
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="relative flex flex-1 flex-col h-screen overflow-y-auto overflow-x-hidden">
        
        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NoSidebarLayout;
