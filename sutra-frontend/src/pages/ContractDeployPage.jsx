import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';

const ContractDeployPage = () => {
    const [solidityCode, setSolidityCode] = useState('');
    const [currentStep, setCurrentStep] = useState('paste');
    const [compileStatus, setCompileStatus] = useState(null);
    const [compiledData, setCompiledData] = useState(null);
    const [deployStatus, setDeployStatus] = useState(null);
    const [deployedAddress, setDeployedAddress] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('mantle');
    const textareaRef = useRef(null);

    const handleCodeChange = (e) => {
        setSolidityCode(e.target.value);
    };

    const handleTabKey = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newValue = solidityCode.substring(0, start) + '    ' + solidityCode.substring(end);
            setSolidityCode(newValue);
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
            }, 0);
        }
    };

    const handleCompile = async () => {
        setCompileStatus('loading');
        try {
            const response = await fetch('http://localhost:8000/sol/compile', { // Make sure this URL matches your backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ solidity_code: solidityCode }),
            });
            const data = await response.json();
            if (response.ok) {
                setCompileStatus('success');
                setCompiledData(data);
            } else {
                setCompileStatus('error');
                alert(data.detail);
            }
        } catch (error) {
            console.error('Compilation error:', error);
            setCompileStatus('error');
        }
    };

    const handleDeploy = async () => {
        if (!compiledData) {
            alert('Compile the contract first.');
            return;
        }

        try {
            setDeployStatus('loading');
            let provider, signer;

            if (selectedNetwork === 'mantle') {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                signer = provider.getSigner();
            } else if (selectedNetwork === 'ganache') {
                provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
                const accounts = await provider.listAccounts();
                signer = provider.getSigner(accounts[0]);
            }

            const factory = new ethers.ContractFactory(compiledData.abi, compiledData.bytecode, signer);
            const contract = await factory.deploy();
            const receipt = await contract.deployTransaction.wait();

            setDeployStatus('success');
            setDeployedAddress(contract.address);
            alert(`Contract deployed successfully at: ${contract.address}`);
            console.log('Deployment Details:', {
                address: contract.address,
                transactionHash: receipt.transactionHash,
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber,
            });
        } catch (error) {
            console.error('Deployment error:', error);
            setDeployStatus('error');
            alert('Failed to deploy the contract. Check the console for details.');
        }
    };


    const resetProcess = () => {
        setSolidityCode('');
        setCurrentStep('paste');
        setCompileStatus(null);
        setCompiledData(null);
        setDeployStatus(null);
        setDeployedAddress('');
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Deploy Your Smart Contract</h1>
            <div className="w-full">
                <div className="flex mb-4">
                    {['paste', 'compile', 'deploy'].map((step, index) => (
                        <button
                            key={step}
                            onClick={() => setCurrentStep(step)}
                            className={`flex-1 text-center py-2 ${currentStep === step ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                                } ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''}`}
                        >
                            {index + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
                        </button>
                    ))}
                </div>

                {currentStep === 'paste' && (
                    <div className="bg-gray-900 shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-white">Paste Your Solidity Code</h2>
                        <p className="text-gray-400 mb-4">Enter your smart contract code below.</p>
                        <textarea
                            ref={textareaRef}
                            placeholder="pragma solidity ^0.8.0;\n\ncontract MyContract {\n    // Your code here\n}"
                            value={solidityCode}
                            onChange={handleCodeChange}
                            onKeyDown={handleTabKey}
                            className="w-full h-96 p-2 bg-gray-800 text-gray-100 font-mono text-sm border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                            spellCheck="false"
                        />
                        <button
                            onClick={() => setCurrentStep('compile')}
                            disabled={!solidityCode.trim()}
                            className={`mt-4 px-4 py-2 rounded-md ${solidityCode.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Proceed to Compile
                        </button>
                    </div>
                )}


                {currentStep === 'compile' && (
                    <div className="bg-gray-900 shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-white">Compile Your Contract</h2>
                        <p className="text-gray-400 mb-4">Compiling your Solidity code...</p>
                        {compileStatus === 'loading' && <p className="text-blue-400">Compiling...</p>}
                        {compileStatus === 'success' && (
                            <div className="text-green-300">Compilation successful. Proceed to deploy.</div>
                        )}
                        {compileStatus === 'error' && (
                            <div className="text-red-400">Error during compilation. Check your code.</div>
                        )}
                        <button
                            onClick={handleCompile}
                            disabled={compileStatus === 'loading'}
                            className={`mt-4 px-4 py-2 rounded-md ${compileStatus === 'loading'
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            {compileStatus === 'loading' ? 'Compiling...' : 'Compile Contract'}
                        </button>
                        <button
                            onClick={() => setCurrentStep('deploy')}
                            disabled={compileStatus !== 'success'}
                            className={`ml-4 mt-4 px-4 py-2 rounded-md ${compileStatus === 'success' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Proceed to Deploy
                        </button>
                    </div>
                )}

                {currentStep === 'deploy' && (
                    <div className="bg-gray-900 shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2 text-white">Deploy Your Smart Contract</h2>
                        <p className="text-gray-400 mb-4">Select the network to deploy:</p>
                        <select
                            value={selectedNetwork}
                            onChange={(e) => setSelectedNetwork(e.target.value)}
                            className="mb-4 p-2 bg-gray-800 text-gray-100 rounded-md"
                        >
                            <option value="mantle">Mantle Testnet</option>
                            <option value="ganache">Ganache Local Network</option>
                        </select>
                        {deployStatus === 'loading' && <p className="text-blue-400">Deploying...</p>}
                        {deployStatus === 'success' && (
                            <div className="text-green-300">
                                Contract deployed successfully at: {deployedAddress}
                                <br />
                                {selectedNetwork === 'mantle' && (
                                    <a
                                        href={`https://explorer.testnet.mantle.xyz/address/${deployedAddress}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 underline"
                                    >
                                        View on Mantle Explorer
                                    </a>
                                )}
                            </div>
                        )}
                        {deployStatus === 'error' && (
                            <div className="text-red-400">Deployment failed. Check console for details.</div>
                        )}
                        <button
                            onClick={handleDeploy}
                            disabled={!compiledData || deployStatus === 'loading'}
                            className={`mt-4 px-4 py-2 rounded-md ${!compiledData || deployStatus === 'loading'
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            {deployStatus === 'loading' ? 'Deploying...' : 'Deploy Contract'}
                        </button>
                        <button
                            onClick={resetProcess}
                            className="ml-4 mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                        >
                            Start Over
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractDeployPage;

