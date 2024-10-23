'use client';

import { Eye, Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/hooks/useQueryParams';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
  id: string;
  title: string;
  category: string;
  createdAt: string;
  questionsCount: number;
}

export default function QuizzesPage({ quizzes }: { quizzes: Quiz[] }) {
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
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleView = (id: string) => {
    console.log(`Viewing quiz ${id}`);
    // Implement view logic here
  };

  const handleTake = (id: string) => {
    console.log(`Taking quiz ${id}`);
    // Implement take quiz logic here
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
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        {/* Add more summary cards here if needed */}
      </div>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Management</CardTitle>
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
            <Button>Create New Quiz</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{quiz.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{quiz.questionsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(quiz.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTake(quiz.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(quiz.id)}
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
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
