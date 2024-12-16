import { useState, useMemo } from 'react'
import { ExternalLink, Search } from 'lucide-react'

// Import the JSON data
import resourcesData from './blockchain-resources.json'

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('Websites')

    const filteredResources = useMemo(() => {
        const resources = resourcesData[activeTab] || []
        return resources.filter((resource) =>
            Object.values(resource).some((value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [searchTerm, activeTab])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const renderResourceCard = (resource) => (
        <div key={resource.name || resource.title} className="bg-white shadow-lg rounded-ss-lg rounded-ee-lg p-6 mb-4 transition-all duration-300 hover:shadow-xl border-2 border-black">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{resource.name || resource.title}</h3>
            {resource.description && (
                <p className="text-gray-600 mb-4">{resource.description}</p>
            )}
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
                Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
            </a>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Blockchain Resources</h1>
                <div className="mb-8 max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="mb-8 flex flex-wrap justify-center">
                    {Object.keys(resourcesData).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`m-1 px-6 py-2 rounded-full transition-all duration-300 ${activeTab === category
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-grey">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">{activeTab}</h2>
                    <div className="h-[600px] overflow-y-auto pr-4 -mr-4">
                        {filteredResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResources.map(renderResourceCard)}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No resources found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

