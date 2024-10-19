import React from 'react';

import { getQuizzes } from '@/actions/quiz';

import QuizzesPage from '@/components/QuizzesPage';

export default async function page({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const userQuizzes = await getQuizzes({
    page: parseInt(searchParams.page) || 1,
    limit: 20,
  });
  return <QuizzesPage quizzes={userQuizzes} />;
}
