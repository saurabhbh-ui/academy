import { useInterface } from '@/providers/InterfaceProvider';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  { number: 1, label: 'Configuration', path: '/configuration' },
  { number: 2, label: 'Outline', path: '/outline' },
  { number: 3, label: 'Briefs', path: '/briefs' },
  { number: 4, label: 'Connect Config', path: '/connect-configuration' },
  { number: 5, label: 'Connect', path: '/connect' },
  { number: 6, label: 'Test Yourself', path: '/test-yourself' },
  { number: 7, label: 'Summary', path: '/summary' },
];

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useInterface();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-muted/40 transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
        aria-label="Toggle sidebar"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-6">
        {!isSidebarCollapsed && (
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Progress
            </h2>
          </div>
        )}

        <nav className="space-y-1 px-2">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = location.pathname.includes(step.path);
            
            return (
              <Link
                key={step.number}
                to={step.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent font-medium',
                  isSidebarCollapsed && 'justify-center'
                )}
              >
                {isSidebarCollapsed ? (
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs', isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    {step.number}
                  </span>
                ) : (
                  <>
                    <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs', isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                      {step.number}
                    </span>
                    <span>{step.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
