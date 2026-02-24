'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headphones, Users, Ticket, BarChart3, Menu, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard/freshdesk', icon: Headphones },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Métricas', href: '/metricas', icon: BarChart3 },
  { name: 'Desempenho', href: '/dashboard/desempenho', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavItems = () => (
    <nav className="space-y-1 px-3 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
        <div className="flex h-16 items-center border-b px-6">
          <Headphones className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">Atendimento</span>
        </div>
        <NavItems />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden absolute left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">Atendimento</span>
          </div>
          <NavItems />
        </SheetContent>
      </Sheet>
    </>
  );
}