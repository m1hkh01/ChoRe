export function EscrowPagination({ currentPage, setCurrentPage, visiblePages, totalPages }) {
    return (
        <>
            <div className="w-full flex items-center justify-end p-3">
                <button onClick={()=>setCurrentPage(1)} disabled={currentPage === 1} className="hover:text-green-600 cursor-pointer !rounded-full py-1 px-2">
                    <i className="bi bi-chevron-double-left text-2xl font-semibold"></i>
                </button>
                <button onClick={() => setCurrentPage(prev => prev--)} disabled={currentPage === 1} className="hover:text-green-600 cursor-pointer !rounded-full py-1 px-2" >
                    <i className="bi bi-chevron-left text-2xl font-semibold"></i>
                </button >
                {
                    visiblePages.length > 0 && visiblePages.map((page) => (
                        <button
                            key={page}
                            className={`!text-xl text-white mx-1 !rounded-sm px-2 ${page == currentPage ? 'bg-green-400':''}`}
                            onClick={()=>setCurrentPage(page)}>
                            { page }
                        </button >
                    ))
                }
                <button onClick={() => setCurrentPage(prev => prev++)} disabled={currentPage == totalPages} className="hover:text-green-600 cursor-pointer !rounded-full py-1 px-2" >
                    <i className="bi bi-chevron-right text-2xl font-semibold"></i>
                </button >
                <button onClick={()=>setCurrentPage(totalPages)} disabled = {currentPage == totalPages}
                    className="hover:text-green-600 cursor-pointer !rounded-full py-1 px-2" >
                    <i className="bi bi-chevron-double-right text-2xl font-semibold"></i>
                </button >
        </div >
            </>
    )
}