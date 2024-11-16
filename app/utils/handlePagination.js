const handlePagination = (pagination) => {
    return {
        hasNextPage: pagination.page < pagination.pages,
        hasPrevPage: pagination.page > 1,
        limit: pagination.limit,
        nextPage: pagination.page < pagination.pages ? pagination.page + 1 : null,
        page: pagination.page,
        pagingCounter: pagination.page,
        prevPage: pagination.page > 1 ? pagination.page - 1 : null,
        totalDocs: pagination.total,
        totalPages: pagination.pages
    };
};

module.exports = handlePagination ;