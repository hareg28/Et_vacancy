'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  BriefcaseBusiness, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  User, 
  UserPlus,
  Building2, 
  Search, 
  Menu, 
  X,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine nav links based on user role
  const getNavLinks = () => {
    if (status === 'authenticated' && session?.user) {
      const userRole = session.user.role;

      if (userRole === 'ADMIN') {
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: ShieldCheck },
          { href: '/admin/users', label: 'Users', icon: User },
          { href: '/admin/companies', label: 'Companies', icon: Building2 },
          { href: '/employer/jobs/create', label: 'Post Job', icon: PlusCircle },
          { href: '/jobs', label: 'Browse Jobs', icon: Search },
        ];
      }

      if (userRole === 'EMPLOYER') {
        return [
          { href: '/', label: 'Home', icon: BriefcaseBusiness },
          { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/employer/jobs/create', label: 'Post Job', icon: PlusCircle },
          { href: '/jobs', label: 'Browse Jobs', icon: Search },
        ];
      }

      // Job Seeker links (default)
      return [
        { href: '/', label: 'Home', icon: BriefcaseBusiness },
        { href: '/jobs', label: 'Find Jobs', icon: BriefcaseBusiness },
        { href: '/companies', label: 'Companies', icon: Building2 },
        { href: '/dashboard', label: 'My Applications', icon: LayoutDashboard },
      ];
    }

    // Not authenticated links
    return [
      { href: '/', label: 'Home', icon: BriefcaseBusiness },
      { href: '/jobs', label: 'Find Jobs', icon: BriefcaseBusiness },
      { href: '/companies', label: 'Companies', icon: Building2 },
    ];
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'EMPLOYER': return 'Employer';
      case 'JOB_SEEKER': return 'Job Seeker';
      default: return 'User';
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BriefcaseBusiness className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            <span className="text-indigo-400">Et</span>_vacancy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              pathname === link.href 
                ? "text-indigo-400 bg-indigo-500/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {session.user?.name?.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{session.user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{getRoleLabel(session.user.role)}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="cursor-pointer">
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal py-1">Switch / Add Account</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/auth/login' })} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Sign In to Another Account
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/auth/register' })} className="cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => signOut()} className="text-rose-500 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={cn(
                "px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all",
                pathname === link.href ? "text-indigo-400 bg-indigo-500/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {status === 'authenticated' ? (
                <Button variant="destructive" onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full justify-start gap-2">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
