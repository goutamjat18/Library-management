import { ReactNode } from 'react';
import LibraryNavbar from './LibraryNavbar';

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function PageLayout({ title, children, sidebar }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LibraryNavbar title={title} />
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {sidebar ? (
          <div className="flex gap-6 items-start">
            {sidebar}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
