'use client';

import { Book, LogOut, Menu, Sunset, Trees, User, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import { useAuthSession } from '@/hooks/auth/useSession';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const subMenuItemsOne = [
    {
        title: 'Question Bank',
        description: 'Access our extensive collection of quiz questions.',
        icon: <Book className="size-5 shrink-0" />,
        href: '/question-bank',
    },
    {
        title: 'AI Quiz Generator',
        description: 'Create quizzes quickly using our AI-powered tool.',
        icon: <Zap className="size-5 shrink-0" />,
        href: '/ai-quiz-generator',
    },
    {
        title: 'Customization',
        description: 'Tailor quizzes to match your curriculum and style.',
        icon: <Sunset className="size-5 shrink-0" />,
        href: '/customization',
    },
    {
        title: 'Support',
        description: 'Reach out to our team or explore the FAQ section.',
        icon: <Trees className="size-5 shrink-0" />,
        href: '/support',
    },
];

const subMenuItemsTwo = [
    {
        title: 'Documentation',
        description: 'Get all the information on how to use our platform.',
        icon: <Book className="size-5 shrink-0" />,
        href: '/documentation',
    },
    {
        title: 'Contact Us',
        description: 'Have any questions? Our team is here to help.',
        icon: <Sunset className="size-5 shrink-0" />,
        href: '/contact',
    },
    {
        title: 'API Status',
        description: 'Check the current status of our services.',
        icon: <Trees className="size-5 shrink-0" />,
        href: '/api-status',
    },
    {
        title: 'Terms & Privacy',
        description: 'Understand the terms and privacy policy of our service.',
        icon: <Zap className="size-5 shrink-0" />,
        href: '/terms-and-privacy',
    },
];

const Header = () => {
    const session = useAuthSession();

    const router = useRouter();

    const handleLogout = async () => {
        router.push('/logout');
    };

    useEffect(() => {}, [session]);

    return (
        <header className="sticky top-0 z-50 py-4 px-8 ">
            <div>
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold">QuizItNow</span>
                        </Link>
                        <div className="flex items-center">
                            <Link
                                className={cn(
                                    '',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    }),
                                )}
                                href="/"
                            >
                                Home
                            </Link>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem className="">
                                        <NavigationMenuTrigger>
                                            <span>Features</span>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="w-80 p-3">
                                                <NavigationMenuLink>
                                                    {subMenuItemsOne.map(
                                                        (item, idx) => (
                                                            <li key={idx}>
                                                                <Link
                                                                    className={cn(
                                                                        'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                                                    )}
                                                                    href={
                                                                        item.href
                                                                    }
                                                                >
                                                                    {item.icon}
                                                                    <div>
                                                                        <div className="text-sm font-semibold">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </div>
                                                                        <p className="text-sm leading-snug ">
                                                                            {
                                                                                item.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </NavigationMenuLink>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem className="">
                                        <NavigationMenuTrigger>
                                            Resources
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="w-80 p-3">
                                                <NavigationMenuLink>
                                                    {subMenuItemsTwo.map(
                                                        (item, idx) => (
                                                            <li key={idx}>
                                                                <Link
                                                                    className={cn(
                                                                        'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                                                    )}
                                                                    href={
                                                                        item.href
                                                                    }
                                                                >
                                                                    {item.icon}
                                                                    <div>
                                                                        <div className="text-sm font-semibold">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </div>
                                                                        <p className="text-sm leading-snug ">
                                                                            {
                                                                                item.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </NavigationMenuLink>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            <Link
                                className={cn(
                                    '',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    }),
                                )}
                                href="/pricing"
                            >
                                Pricing
                            </Link>
                            <Link
                                className={cn(
                                    '',
                                    navigationMenuTriggerStyle,
                                    buttonVariants({
                                        variant: 'ghost',
                                    }),
                                )}
                                href="#"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                    {session?.status === 'unauthenticated' ? (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant={'outline'}>Log in</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            session?.data?.user?.image ||
                                            'https://github.com/shadcn.png'
                                        }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/profile">
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </nav>
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                                className=""
                                alt="logo"
                                width={32}
                                height={32}
                            />
                            <span className="text-xl font-bold">
                                Quiz Master
                            </span>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant={'outline'} size={'icon'}>
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                                                className="w-8"
                                                alt="logo"
                                            />
                                            <span className="text-xl font-bold">
                                                Quiz Master
                                            </span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="my-8 flex flex-col gap-4">
                                    <Link href="/" className="font-semibold">
                                        Home
                                    </Link>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <AccordionItem
                                            value="features"
                                            className="border-b-0"
                                        >
                                            <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                                                Features
                                            </AccordionTrigger>
                                            <AccordionContent className="mt-2">
                                                {subMenuItemsOne.map(
                                                    (item, idx) => (
                                                        <Link
                                                            key={idx}
                                                            className={cn(
                                                                'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                                            )}
                                                            href={item.href}
                                                        >
                                                            {item.icon}
                                                            <div>
                                                                <div className="text-sm font-semibold">
                                                                    {item.title}
                                                                </div>
                                                                <p className="text-sm leading-snug ">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ),
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="resources"
                                            className="border-b-0"
                                        >
                                            <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                                                Resources
                                            </AccordionTrigger>
                                            <AccordionContent className="mt-2">
                                                {subMenuItemsTwo.map(
                                                    (item, idx) => (
                                                        <Link
                                                            key={idx}
                                                            className={cn(
                                                                'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                                            )}
                                                            href={item.href}
                                                        >
                                                            {item.icon}
                                                            <div>
                                                                <div className="text-sm font-semibold">
                                                                    {item.title}
                                                                </div>
                                                                <p className="text-sm leading-snug ">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ),
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                    <Link
                                        href="/pricing"
                                        className="font-semibold"
                                    >
                                        Pricing
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="font-semibold"
                                    >
                                        Blog
                                    </Link>
                                </div>
                                {session?.status === 'authenticated' ? (
                                    <div className="border-t pt-4">
                                        <div className="mt-2 flex flex-col gap-3">
                                            <Link href="/profile">
                                                <Button variant={'outline'}>
                                                    Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-t pt-4">
                                        <div className="mt-2 flex flex-col gap-3">
                                            <Link href="/login">
                                                <Button variant={'outline'}>
                                                    Log in
                                                </Button>
                                            </Link>
                                            <Link href="/signup">
                                                <Button>Get Started</Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
