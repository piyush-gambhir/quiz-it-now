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
    _id: string;
    quizId: string;
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    tags: string[];
    numberOfQuestions: number;
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

    const filteredQuizzes = quizzes.filter(
        (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
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

    const handleDeleteQuiz = async (quizId: string) => {
        // TODO: Implement delete functionality
        console.log('Delete quiz:', quizId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex justify-between items-center">
                        <Input
                            type="search"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentQuizzes.map((quiz) => (
                                    <TableRow key={quiz._id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {quiz.title}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {quiz.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {quiz.topic}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    quiz.difficulty === 'Easy'
                                                        ? 'default'
                                                        : quiz.difficulty ===
                                                            'Medium'
                                                          ? 'secondary'
                                                          : quiz.difficulty ===
                                                              'Hard'
                                                            ? 'destructive'
                                                            : 'outline'
                                                }
                                            >
                                                {quiz.difficulty}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {quiz.numberOfQuestions}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                quiz.createdAt,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/quiz/view/${quiz.quizId}`}
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
                                                        handleDeleteQuiz(
                                                            quiz.quizId,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-end space-x-2 py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1,
                                                )
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
                                                handlePageChange(
                                                    currentPage + 1,
                                                )
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
