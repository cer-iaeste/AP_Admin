import React, { useState, useEffect } from "react";

interface PaginationProps {
    data: any[]
    setPaginatedData: (data: any[]) => void
    rows?: number
}

const Pagination: React.FC<PaginationProps> = ({ data, setPaginatedData, rows }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(3)

    useEffect(() => {
        if (data.length) {
            console.log(data)
            setTotalPages(Math.ceil(data.length / rowsPerPage))
            setPaginatedData(data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage))
        }

    }, [data, currentPage, rowsPerPage])

    useEffect(() => {
        setRowsPerPage(rows ?? 3)
    }, [rows])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }

    return (
        <section>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-blue-100"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded border ${currentPage === i + 1
                                ? "bg-[#1B75BB] text-white"
                                : "bg-white text-gray-700 hover:bg-blue-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-blue-100"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    )
}

export default Pagination