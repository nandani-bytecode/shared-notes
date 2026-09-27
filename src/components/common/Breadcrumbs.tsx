import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm text-slate-500 font-medium ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link to="/workspace" className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 max-w-[150px] truncate"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className={`flex items-center gap-1 ${isLast ? 'text-slate-900 font-semibold max-w-[200px] truncate' : ''}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
