import React from 'react';

export default function page({ params }: { params: { quiz_id: string } }) {
  const { quiz_id } = params;

  return <div>Quiz</div>;
}
