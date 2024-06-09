import React from 'react'

const LoadMoreDataButton = ({ state, fetchDataFunc, additionalParams }) => {

    if (state !== null && state.totalDocs > state.results.length) {
        return (
            <button
                className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                onClick={() => fetchDataFunc({ ...additionalParams, page: state.page + 1 })}
            >
                Load More
            </button>
        )
    }
}

export default LoadMoreDataButton
