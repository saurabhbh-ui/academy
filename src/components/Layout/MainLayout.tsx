import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const location = useLocation();
  
  // Workflow pages need full height
  const isWorkflowPage = [
    '/outline',
    '/briefs',
    '/connect',
    '/test-yourself',
    '/summary'
  ].some(path => location.pathname.includes(path));

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className={isWorkflowPage ? 'h-full px-8 py-8' : 'container py-8 px-8'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
