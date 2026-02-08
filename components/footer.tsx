import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="border-t border-border/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
                            Q
                        </div>
                        <span className="text-sm font-semibold">QuizItNow</span>
                    </div>

                    <nav className="flex flex-wrap items-center gap-6">
                        <Link
                            href="/privacy-policy"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Terms
                        </Link>
                        <Link
                            href="/cookie-policy"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Cookies
                        </Link>
                        <Link
                            href="/contact-us"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="GitHub"
                        >
                            <FaGithub className="size-4" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="size-4" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 border-t border-border/40 pt-6">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} QuizItNow. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
