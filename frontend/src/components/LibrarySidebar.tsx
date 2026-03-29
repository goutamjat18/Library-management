import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarSection {
  title: string;
  links: { to: string; label: string; icon?: LucideIcon; end?: boolean }[];
}

interface LibrarySidebarProps {
  sections: SidebarSection[];
}

export default function LibrarySidebar({ sections }: LibrarySidebarProps) {
  return (
    <aside className="w-56 shrink-0">
      <div className="glass-card p-4 sticky top-4">
        {sections.map((section, i) => (
          <div key={i} className={cn(i > 0 && 'mt-5')}>
            <h3 className="text-[0.68rem] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-3">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )
                  }
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
