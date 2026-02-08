'use client';

import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthSession } from '@/hooks/auth/use-session';
import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/quiz/generate', label: 'Create' },
    { href: '/quiz', label: 'My Quizzes' },
];

function getInitials(name?: string | null) {
    if (!name) return 'QI';
    const parts = name.trim().split(/\s+/);
    return parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('');
}

const Header = () => {
    const session = useAuthSession();
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const isAuthenticated = session?.status === 'authenticated';

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
            <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                        Q
                    </div>
                    <span className="text-base font-semibold tracking-tight">
                        QuizItNow
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                                pathname === item.href
                                    ? 'text-foreground bg-muted'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop auth */}
                <div className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                            setTheme(theme === 'dark' ? 'light' : 'dark')
                        }
                        aria-label="Toggle theme"
                    >
                        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    {!isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-auto rounded-full p-0"
                                    aria-label="Account menu"
                                >
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={
                                                session.data?.user?.image ||
                                                undefined
                                            }
                                            alt={
                                                session.data?.user?.name ||
                                                'User'
                                            }
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                            {getInitials(
                                                session.data?.user?.name,
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-sm font-medium">
                                        {session.data?.user?.name ||
                                            'My Account'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {session.data?.user?.email}
                                    </p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => router.push('/logout')}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 size-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9"
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>QuizItNow</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'rounded px-3 py-2.5 text-sm font-medium transition-colors',
                                            pathname === item.href
                                                ? 'bg-muted text-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-6 border-t pt-4 flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        setTheme(
                                            theme === 'dark' ? 'light' : 'dark',
                                        )
                                    }
                                >
                                    <Sun className="mr-2 size-4 dark:hidden" />
                                    <Moon className="mr-2 size-4 hidden dark:block" />
                                    {theme === 'dark'
                                        ? 'Light mode'
                                        : 'Dark mode'}
                                </Button>
                                {isAuthenticated ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-destructive"
                                            onClick={() =>
                                                router.push('/logout')
                                            }
                                        >
                                            <LogOut className="mr-2 size-4" />
                                            Log out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <Link href="/login">
                                                Log in
                                            </Link>
                                        </Button>
                                        <Button className="w-full" asChild>
                                            <Link href="/register">
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
};

export default Header;
