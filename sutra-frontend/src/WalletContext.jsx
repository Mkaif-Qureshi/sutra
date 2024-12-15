import React, { createContext, useState, useContext } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") { // Check if MetaMask is installed
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum); // Use Web3Provider for v5.7.2
                await provider.send("eth_requestAccounts", []); // Request accounts
                const signer = provider.getSigner(); // Get signer
                const account = await signer.getAddress(); // Get wallet address
                setWalletAddress(account); // Save wallet address to state
            } catch (error) {
                console.error("Error connecting wallet:", error); // Log any error during connection
            }
        } else {
            alert("No Ethereum provider found. Please install MetaMask!"); // Alert if MetaMask not found
        }
    };

    return (
        <WalletContext.Provider value={{ walletAddress, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
