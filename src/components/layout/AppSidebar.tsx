import { Home, ListTodo, BookHeart, Briefcase, LayoutDashboard, Gamepad2, Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Task Scheduler', path: '/tasks', icon: ListTodo },
  { title: 'Digital Diary', path: '/diary', icon: BookHeart },
  { title: 'Career Development', path: '/career', icon: Briefcase },
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Relaxation', path: '/relaxation', icon: Gamepad2 },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">AUTOAIDE</h1>
        <p className="text-xs text-sidebar-foreground/70 mt-1">
          Integrated Daily Empowerment
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-sidebar-accent',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          © 2025 AUTOAIDE
        </p>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground flex-col fixed left-0 top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="bg-background">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar text-sidebar-foreground">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
