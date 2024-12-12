import React, { useState, useCallback } from "react";
import axios from 'axios';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import 'prismjs';
import 'prismjs/components/prism-solidity.min.js'; // Import Solidity syntax highlighter
import ReactMarkdown from 'react-markdown';
import templates from './smart_contract_templates_updated.json';
import { Download, Upload } from 'lucide-react';


axios.defaults.baseURL = 'http://localhost:8000'; // Replace with your FastAPI backend URL

// Icons for different block types
const FunctionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 3h3v2H6V9zm0 4h3v2H6v-2zm5-4h7v2h-7V9zm0 4h7v2h-7v-2z" />
    </svg>
);

const EventIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
);

const ModifierIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
);

const VariableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm2 0h12v10H6V7zm3 2v6h2V9H9zm4 0v6h2V9h-2z" />
    </svg>
);

const initialNodes = [
    {
        id: "1",
        type: "function",
        data: { label: "Start" },
        position: { x: 250, y: 5 },
    },
];

const initialEdges = [];

const nodeTypes = {
    function: ({ data }) => (
        <div className="px-4 py-2 shadow-md rounded-md bg-blue-100 border-2 border-blue-500">
            <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-500" />
            <div className="flex items-center">
                <FunctionIcon />
                <div className="ml-2 text-lg font-bold">{data.label}</div>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-blue-500" />
        </div>
    ),
    event: ({ data }) => (
        <div className="px-4 py-2 shadow-md rounded-md bg-green-100 border-2 border-green-500">
            <Handle type="target" position={Position.Top} className="w-4 h-4 bg-green-500" />
            <div className="flex items-center">
                <EventIcon />
                <div className="ml-2 text-lg font-bold">{data.label}</div>
            </div>
        </div>
    ),
    modifier: ({ data }) => (
        <div className="px-4 py-2 shadow-md rounded-md bg-yellow-100 border-2 border-yellow-500">
            <Handle type="target" position={Position.Top} className="w-4 h-4 bg-yellow-500" />
            <div className="flex items-center">
                <ModifierIcon />
                <div className="ml-2 text-lg font-bold">{data.label}</div>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-yellow-500" />
        </div>
    ),
    variable: ({ data }) => (
        <div className="px-4 py-2 shadow-md rounded-md bg-purple-100 border-2 border-purple-500">
            <Handle type="target" position={Position.Top} className="w-4 h-4 bg-purple-500" />
            <div className="flex items-center">
                <VariableIcon />
                <div className="ml-2 text-lg font-bold">{data.label}</div>
            </div>
            <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-purple-500" />
        </div>
    ),
};

const DraggableElement = ({ label, type }) => {
    return (
        <div
            className="p-2 bg-gray-200 rounded cursor-pointer mb-2 flex items-center"
            draggable
            onDragStart={(event) => event.dataTransfer.setData("application/reactflow", JSON.stringify({ label, type }))}
        >
            {type === "function" && <FunctionIcon />}
            {type === "event" && <EventIcon />}
            {type === "modifier" && <ModifierIcon />}
            {type === "variable" && <VariableIcon />}
            <span className="ml-2">{label}</span>
        </div>
    );
};

const isValidConnection = (source, target) => {
    const validConnections = {
        function: ['event', 'variable', 'modifier'],
        event: ['function'],
        modifier: ['function', 'variable'],
        variable: ['function', 'modifier'],
    };

    return validConnections[source]?.includes(target);
};

const ContractBuilderPage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [purpose, setPurpose] = useState(""); // Purpose text state
    const [generatedCode, setGeneratedCode] = useState("");
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const onConnect = useCallback(
        (params) => {
            const sourceNode = nodes.find(node => node.id === params.source);
            const targetNode = nodes.find(node => node.id === params.target);

            if (isValidConnection(sourceNode.type, targetNode.type)) {
                setEdges((eds) => addEdge({
                    ...params,
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#555' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#555' }
                }, eds));
            } else {
                // Visual feedback for invalid connection
                const tempEdge = {
                    ...params,
                    id: 'temp-edge',
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: 'red' },
                    markerEnd: { type: MarkerType.ArrowClosed, color: 'red' }
                };
                setEdges((eds) => [...eds, tempEdge]);
                setTimeout(() => {
                    setEdges((eds) => eds.filter(e => e.id !== 'temp-edge'));
                }, 1000);
            }
        },
        [nodes, setEdges]
    );

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = event.currentTarget.getBoundingClientRect();
            const { label, type } = JSON.parse(event.dataTransfer.getData("application/reactflow"));

            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            const newNode = {
                id: String(nodes.length + 1),
                type,
                position,
                data: { label },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [nodes, setNodes]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onNodesDelete = useCallback(
        (deletedNodes) => {
            setNodes((nds) => nds.filter((node) => !deletedNodes.some((deletedNode) => deletedNode.id === node.id)));
        },
        [setNodes]
    );

    const onEdgesDelete = useCallback(
        (deletedEdges) => {
            setEdges((eds) => eds.filter((edge) => !deletedEdges.some((deletedEdge) => deletedEdge.id === edge.id)));
        },
        [setEdges]
    );

    const onSelectionChange = useCallback(({ nodes }) => {
        setSelectedNodes(nodes);
    }, []);

    const onSave = useCallback(() => {
        const flow = { nodes, edges };
        localStorage.setItem('contractFlow', JSON.stringify(flow));
        alert('Contract flow saved!');
    }, [nodes, edges]);

    const onRestore = useCallback(() => {
        const flow = JSON.parse(localStorage.getItem('contractFlow'));
        if (flow) {
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
        }
    }, [setNodes, setEdges]);

    const onClear = useCallback(() => {
        setNodes([]);
        setEdges([]);
    }, [setNodes, setEdges]);


    const onGenerateCode = useCallback(() => {
        const flow = { nodes, edges }; // Assuming nodes and edges are already defined
        axios.post('contract/generate-solidity', {
            flowJson: flow,
            purpose: purpose,
        })
            .then((response) => {
                setGeneratedCode(response.data.solidity_code); // Assuming response contains the generated code
                setShowModal(false);
            })
            .catch((error) => {
                console.error('Error generating code:', error);
                alert("Failed to generate code. Please try again.");
            });
    }, [nodes, edges, purpose]);

    const handlePurposeChange = (event) => {
        setPurpose(event.target.value);
    };

    const openCodeModal = useCallback(() => {
        if (generatedCode) {
            setShowCodeModal(true);
        }
    }, [generatedCode]);

    const handleTemplateSelect = (template) => {
        setNodes(template.nodes);
        setEdges(template.edges);
        setSelectedTemplate(template);
    };

    const handleDownloadTemplate = () => {
        const flow = { nodes, edges };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleUploadTemplate = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const template = JSON.parse(e.target.result);
            setNodes(template.nodes || []);
            setEdges(template.edges || []);
        };
        reader.readAsText(file);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <ReactFlowProvider>
                <div className="flex min-h-screen">
                    <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Component Palette</h2>
                        <div className="mb-4 flex justify-start flex-wrap gap-2">
                            <button onClick={onSave} className="bg-blue-500 text-white px-2 py-1  text-sm">Save</button>
                            <button onClick={onRestore} className="bg-green-500 text-white px-2 py-1  text-sm">Restore</button>
                            <button onClick={onClear} className="bg-red-500 text-white px-2 py-1  text-sm">Clear</button>
                            <button onClick={handleDownloadTemplate} className="bg-purple-500 text-white px-2 py-1  text-sm flex items-center">
                                <Download size={16} className="mr-1" /> Download
                            </button>
                            <label className="bg-orange-500 text-white px-2 py-1  text-sm flex items-center cursor-pointer">
                                <Upload size={16} className="mr-1" /> Upload
                                <input type="file" onChange={handleUploadTemplate} className="hidden" accept=".json" />
                            </label>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-500 text-white px-2 py-1  text-sm"
                            >
                                Generate
                            </button>
                        </div>
                        {generatedCode && (
                            <>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Generated Code</h2>
                                <button
                                    onClick={openCodeModal}
                                    className="bg-gray-200 text-gray-700 p-2 "
                                    aria-label="View generated code"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </>
                        )}

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Functions</h3>
                            <DraggableElement label="Constructor" type="function" />
                            <DraggableElement label="Getter/Setter" type="function" />
                            <DraggableElement label="Transfer" type="function" />
                            <DraggableElement label="Approval" type="function" />
                        </div>
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Events</h3>
                            <DraggableElement label="Transfer Event" type="event" />
                            <DraggableElement label="Approval Event" type="event" />
                        </div>
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Modifiers</h3>
                            <DraggableElement label="onlyOwner" type="modifier" />
                            <DraggableElement label="payable" type="modifier" />
                            <DraggableElement label="nonReentrant" type="modifier" />
                        </div>
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Variables</h3>
                            <DraggableElement label="uint" type="variable" />
                            <DraggableElement label="address" type="variable" />
                            <DraggableElement label="mapping" type="variable" />
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Templates</h3>
                            <select
                                onChange={(e) => handleTemplateSelect(templates.find(t => t.template_name === e.target.value))}
                                className="w-full p-2 border border-gray-300 "
                            >
                                <option value="">Select a template</option>
                                {templates.map((template, index) => (
                                    <option key={index} value={template.template_name}>
                                        {template.template_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Generated Solidity Code</h3>
                            {generatedCode ? (
                                <div className="bg-gray-100 p-2  overflow-auto max-h-64">
                                    <pre className="text-xs">{generatedCode}</pre>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No code generated yet.</p>
                            )}
                        </div>


                    </div>

                    {/* Modal for entering the purpose */}
                    {showModal && (
                        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                            <div className="bg-white p-6  w-1/3">
                                <h3 className="text-xl font-semibold mb-4">Enter Code Purpose</h3>
                                <textarea
                                    className="w-full p-2 border border-gray-300  mb-4"
                                    placeholder="Enter the purpose of the code..."
                                    value={purpose}
                                    onChange={handlePurposeChange}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 text-black px-4 py-2 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            onGenerateCode();
                                            setShowModal(false); // Close modal after generating code
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Code Modal */}
                    {showCodeModal && (
                        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                            <div className="bg-white p-6 w-3/4 max-h-[80vh] overflow-auto">
                                <h3 className="text-xl font-semibold mb-4">Response: </h3>

                                <ReactMarkdown>
                                    {generatedCode}
                                </ReactMarkdown>


                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => setShowCodeModal(false)}
                                        className="bg-blue-500 text-white px-4 py-2 "
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 bg-gray-100">
                        <ReactFlow
                            nodes={nodes.map((node) => ({
                                ...node,
                                style: {
                                    ...node.style,
                                    backgroundColor: selectedNodes.some((n) => n.id === node.id) ? '#ff8a65' : undefined,
                                    border: selectedNodes.some((n) => n.id === node.id) ? '2px solid #ff5722' : undefined,
                                },
                            }))}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodesDelete={onNodesDelete}
                            onEdgesDelete={onEdgesDelete}
                            onSelectionChange={onSelectionChange}
                            nodeTypes={nodeTypes}
                            fitView
                            deleteKeyCode={["Backspace", "Delete"]}
                        >
                            <MiniMap />
                            <Controls />
                            <Background variant="dots" gap={12} size={1} />
                        </ReactFlow>
                    </div>
                </div>
            </ReactFlowProvider>
        </DndProvider>
    );
};

export default ContractBuilderPage;

