import React from 'react';
import { Handle, Position } from 'reactflow';
import { FunctionIcon, EventIcon, ModifierIcon, VariableIcon } from './Icons';

export const nodeTypes = {
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
