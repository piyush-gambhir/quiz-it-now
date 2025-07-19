'use client';

import { Eye, Play, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/hooks/useQueryParams';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Quiz {
    quizId: string;
    userId: string;
    input: string;
    model: string;
    quiz: any;
    createdAt: string;
    updatedAt: string;
}

export default function QuizzesPage({
    quizzes,
}: Readonly<{ quizzes: Quiz[] }>) {
    const [queryParams, setQueryParams] = useQueryParams();
    const [currentPage, setCurrentPage] = useState(
        parseInt(queryParams.page || '1'),
    );
    const [searchTerm, setSearchTerm] = useState(queryParams.search || '');
    const itemsPerPage = 10;

    useEffect(() => {
        setQueryParams({ page: currentPage.toString(), search: searchTerm });
    }, [currentPage, searchTerm, setQueryParams]);

    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.quiz.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleDelete = (id: string) => {
        console.log(`Deleting quiz ${id}`);
        // Implement delete logic here
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 px-4">
                <Card className="shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Quizzes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {quizzes.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-none border-none">
                <CardContent>
                    <div className="mb-4 flex justify-between items-center">
                        <Input
                            type="search"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="max-w-sm"
                        />
                        <Link href="/quiz/generate" prefetch={true}>
                            <Button>Create New Quiz</Button>
                        </Link>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="grid grid-cols-8">
                                    <TableHead className="col-span-3">
                                        Title
                                    </TableHead>
                                    <TableHead className="col-span-2">
                                        Category
                                    </TableHead>
                                    <TableHead className="col-span-1">
                                        Created At
                                    </TableHead>
                                    <TableHead className="col-span-1">
                                        Questions
                                    </TableHead>
                                    <TableHead className="col-span-1">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentQuizzes.map((quiz) => (
                                    <TableRow
                                        key={quiz.quizId}
                                        className="grid grid-cols-8"
                                    >
                                        <TableCell className="font-medium col-span-3">
                                            {quiz.quiz.title}
                                        </TableCell>
                                        <TableCell className="flex flex-wrap gap-2 col-span-2">
                                            {quiz.quiz.tags.map(
                                                (tag: string) => (
                                                    <Badge
                                                        className="h-min"
                                                        variant="secondary"
                                                        key={tag}
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ),
                                            )}
                                        </TableCell>
                                        <TableCell className="col-span-1">
                                            {new Date(
                                                quiz.createdAt,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="col-span-1">
                                            {quiz.quiz.numberOfQuestions}
                                        </TableCell>
                                        <TableCell className="col-span-1">
                                            <Link
                                                href={`/quiz/view/${quiz.quizId}`}
                                                prefetch={true}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/quiz/${quiz.quizId}`}
                                                prefetch={true}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(quiz.quizId)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4 flex items-center justify-end space-x-2 py-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        className={
                                            currentPage === 1
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        className={
                                            currentPage === totalPages
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
