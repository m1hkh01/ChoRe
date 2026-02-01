import { useMemo, useState } from "react";

export function usePagination({
    totalItems,
    itemsPerPage = 6,
    maxPageIndex = 5
}) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        const count = Math.ceil(totalItems / itemsPerPage);
        return Array.from({ length: count }, (_, i) => i + 1);
    }, [totalItems, itemsPerPage]);

    const minPageIndex = useMemo(() => {
        const half = Math.floor(maxPageIndex / 2);
        let start = currentPage - half;

        if (start < 1) start = 1;

        if (start + maxPageIndex - 1 > totalPages.length) {
            start = Math.max(1, totalPages.length - maxPageIndex + 1);
        }

        return start;
    }, [currentPage, maxPageIndex, totalPages.length]);

    const visiblePages = useMemo(() => {
        return totalPages.slice(
            minPageIndex - 1,
            minPageIndex - 1 + maxPageIndex
        );
    }, [totalPages, minPageIndex, maxPageIndex]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        visiblePages
    };
}
