import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LearnWithAIPage() {
    const [topic, setTopic] = useState('');
    const [resources, setResources] = useState(null);
    const [mindmapMarkdown, setMindmapMarkdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResources(null);
        setMindmapMarkdown(null);

        try {
            // Fetch resources
            const resourceResponse = await fetch('http://127.0.0.1:8000/learn/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!resourceResponse.ok) {
                throw new Error('Failed to fetch resources');
            }

            const resourceData = await resourceResponse.json();
            setResources(resourceData.resources);

            // Fetch mindmap in Markdown format
            const mindmapResponse = await fetch('http://127.0.0.1:8000/learn/mindmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!mindmapResponse.ok) {
                throw new Error('Failed to fetch mindmap');
            }

            const mindmapData = await mindmapResponse.json();
            setMindmapMarkdown(mindmapData.mindmap_markdown);
        } catch (err) {
            setError('An error occurred while fetching data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Learn with AI</h1>
                <form onSubmit={handleSubmit} className="mb-8 max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter a topic to learn about..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            required
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                            disabled={loading}
                        >
                            Learn
                        </button>
                    </div>
                </form>
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {error && <div className="text-center py-8 text-red-500">{error}</div>}

                {resources && (
                    <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
                        <ReactMarkdown
                            components={{
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-4" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                                a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            }}
                        >
                            {resources}
                        </ReactMarkdown>
                    </div>
                )}

                {mindmapMarkdown && (
                    <div className="mt-8 bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                        <h2 className="text-2xl font-semibold mb-4">Mindmap to follow</h2>
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-4" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-3" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                            }}
                        >
                            {mindmapMarkdown}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}