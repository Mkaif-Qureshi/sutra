import React from 'react';
import ReactMarkdown from 'react-markdown';

const SecurityCheckResults = ({ results }) => {
    if (!results) return null;

    if (results.error) {
        return <div className="text-red-500 mt-4">Error: {results.error}</div>;
    }

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Security Check Results</h3>
            <div className="bg-gray-800 p-4 rounded">
                <ReactMarkdown className="prose prose-invert">{results.response}</ReactMarkdown>
            </div>
        </div>
    );
};

export default SecurityCheckResults;
