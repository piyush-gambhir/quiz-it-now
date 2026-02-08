'use client';

import {
    Calendar,
    Copy,
    Eye,
    HelpCircle,
    Play,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { QuizDocument } from '@/lib/types/quiz';

import { useAuthSession } from '@/hooks/auth/use-session';
import { useQueryParams } from '@/hooks/use-query-params';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { toast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 12;

function getDifficultyColor(difficulty: string) {
    if (difficulty === 'Easy')
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    if (difficulty === 'Medium')
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
    if (difficulty === 'Hard')
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900';
    return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
}

export default function QuizzesPage({
    quizzes: initialQuizzes,
}: Readonly<{ quizzes: QuizDocument[] }>) {
    const [queryParams, setQueryParams] = useQueryParams();
    const [currentPage, setCurrentPage] = useState(
        Number.parseInt(queryParams.page || '1', 10) || 1,
    );
    const [searchTerm, setSearchTerm] = useState(queryParams.search || '');
    const [quizzes, setQuizzes] = useState(initialQuizzes);
    const [deleteTarget, setDeleteTarget] = useState<{
        quizId: string;
        title: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: session } = useAuthSession();

    useEffect(() => {
        setQueryParams({ page: currentPage.toString(), search: searchTerm });
    }, [currentPage, searchTerm, setQueryParams]);

    const filteredQuizzes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return quizzes;

        return quizzes.filter((quiz) => {
            const title = quiz.quiz?.title?.toLowerCase() || '';
            const description = quiz.quiz?.description?.toLowerCase() || '';
            const topic = quiz.quiz?.topic?.toLowerCase() || '';
            const tags = quiz.quiz?.tags?.join(' ').toLowerCase() || '';
            return (
                title.includes(term) ||
                description.includes(term) ||
                topic.includes(term) ||
                tags.includes(term)
            );
        });
    }, [quizzes, searchTerm]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE),
    );
    const safePage = Math.min(Math.max(currentPage, 1), totalPages);
    const currentQuizzes = filteredQuizzes.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
    );

    const handleDeleteQuiz = async () => {
        if (!deleteTarget || !session?.user?.id) return;

        setIsDeleting(true);
        try {
            const res = await fetch(
                `/api/quiz/${deleteTarget.quizId}?userId=${session.user.id}`,
                { method: 'DELETE' },
            );

            if (res.ok) {
                setQuizzes((prev) =>
                    prev.filter((q) => q.quizId !== deleteTarget.quizId),
                );
                toast({
                    title: 'Quiz deleted',
                    description: `"${deleteTarget.title}" has been removed.`,
                });
            } else {
                toast({
                    title: 'Failed to delete',
                    description: 'Something went wrong. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch {
            toast({
                title: 'Failed to delete',
                description: 'A network error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleCopyLink = async (quizId: string) => {
        const url = `${window.location.origin}/quiz/${quizId}`;
        try {
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Link copied',
                description: 'Quiz link copied to clipboard.',
            });
        } catch {
            toast({
                title: 'Copy failed',
                description: 'Could not copy the link.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        My Quizzes
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {filteredQuizzes.length} quiz
                        {filteredQuizzes.length !== 1 ? 'zes' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full max-w-56">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-9 pl-9 text-sm"
                        />
                    </div>
                    <Link href="/quiz/generate">
                        <Button size="sm" className="gap-1.5">
                            <Plus className="size-3.5" />
                            New Quiz
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Empty state */}
            {currentQuizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-4 py-16 sm:py-20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                        <HelpCircle className="size-5 text-muted-foreground" />
                    </div>
                    <p className="mt-4 font-medium">No quizzes found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {searchTerm
                            ? 'Try a different search term.'
                            : 'Create your first quiz to get started.'}
                    </p>
                    {!searchTerm && (
                        <Link href="/quiz/generate" className="mt-5">
                            <Button size="sm" className="gap-1.5">
                                <Plus className="size-3.5" />
                                Create Quiz
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                /* Quiz card grid */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {currentQuizzes.map((quiz) => (
                        <div
                            key={quiz.quizId}
                            className="group relative flex flex-col rounded-md border border-border bg-card transition-colors hover:border-foreground/15"
                        >
                            {/* Card body */}
                            <div className="flex flex-1 flex-col p-4 sm:p-5">
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`text-[11px] font-medium ${getDifficultyColor(quiz.quiz.difficulty)}`}
                                    >
                                        {quiz.quiz.difficulty}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="text-[11px] font-normal"
                                    >
                                        {quiz.quiz.topic}
                                    </Badge>
                                </div>

                                <h3 className="mb-1 font-semibold leading-snug line-clamp-2">
                                    {quiz.quiz.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {quiz.quiz.description}
                                </p>

                                <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <HelpCircle className="size-3" />
                                        {quiz.quiz.numberOfQuestions} Qs
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {new Date(
                                            quiz.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Card footer actions */}
                            <div className="flex items-center border-t border-border">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/quiz/view/${quiz.quizId}`}
                                            className="flex-1"
                                        >
                                            <button className="flex w-full items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                                                <Eye className="size-3" />
                                                View
                                            </button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        View quiz details
                                    </TooltipContent>
                                </Tooltip>
                                <div className="w-px self-stretch bg-border" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/quiz/${quiz.quizId}`}
                                            className="flex-1"
                                        >
                                            <button className="flex w-full items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                                                <Play className="size-3" />
                                                Take
                                            </button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Take this quiz
                                    </TooltipContent>
                                </Tooltip>
                                <div className="w-px self-stretch bg-border" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() =>
                                                handleCopyLink(quiz.quizId)
                                            }
                                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <Copy className="size-3" />
                                            Copy
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Copy quiz link
                                    </TooltipContent>
                                </Tooltip>
                                <div className="w-px self-stretch bg-border" />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() =>
                                                setDeleteTarget({
                                                    quizId: quiz.quizId,
                                                    title: quiz.quiz.title,
                                                })
                                            }
                                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                                        >
                                            <Trash2 className="size-3" />
                                            Delete
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete quiz</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(safePage - 1)}
                                    className={
                                        safePage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(p)}
                                        isActive={safePage === p}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(safePage + 1)}
                                    className={
                                        safePage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &ldquo;
                            {deleteTarget?.title}&rdquo;. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteQuiz}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
