'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Calendar', icon: '📅' },
  { href: '/members', label: 'Team Members', icon: '👥' },
  { href: '/history', label: 'History', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-800 text-slate-200 flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold text-white">Home Activities</h1>
        <p className="text-xs text-slate-400 mt-1">Activity Management</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors
                ${active
                  ? 'bg-slate-700 text-white border-r-2 border-blue-400'
                  : 'hover:bg-slate-700/50 text-slate-300'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
