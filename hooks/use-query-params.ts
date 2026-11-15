'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type QueryParams = Record<string, string>;

export const useQueryParams = (): [
    QueryParams,
    (newQueryParams: QueryParams) => void,
] => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryParams: QueryParams = Object.fromEntries(searchParams.entries());

    const setQueryParams = (newQueryParams: QueryParams) => {
        const updatedSearchParams = new URLSearchParams(newQueryParams);
        router.replace(`?${updatedSearchParams.toString()}`, { scroll: false });
    };

    return [queryParams, setQueryParams];
};
