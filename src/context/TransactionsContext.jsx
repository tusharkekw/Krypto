import React , {useEffect, useLayoutEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI , contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const createEthereumContract = ()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI , signer);
    
    return transactionContract;
}

export const TransactionProvider = ({children}) =>{
    const [connectedAccount , setConnectedAccount] = useState('');
    const [formData , setFormData] = useState({addressTo :'' , amount :'' , keyword:'', message:''})
    const [isLoading , setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name)=>{
        setFormData((prevState)=>({...prevState , [name]:e.target.value}))
    }

    const getAllTransactions = async()=>{
        try {
            if(!ethereum) return alert("Install metamask");

            const transactionsContract = createEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();
            console.log(availableTransactions);
            const structuredTransactions = availableTransactions.map((transaction)=>({
                addressFrom:transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message:transaction.message,
                keyword:transaction.keyword,
                amount:parseInt(transaction.amount._hex) / (10**10)
            }))
            console.log("adfasdfa")
            setTransactions(structuredTransactions);
            console.log(structuredTransactions);
        } catch (error) {
            
        }
    }
    const checkIfWalletIsConnected = async()=>{
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({method : 'eth_accounts'});
            if(accounts.length){ 
                setConnectedAccount(accounts[0]);
    
                //get all transactions
                getAllTransactions();
            }else{
                console.log("No account found");
            }
            console.log(accounts);
        } 
        catch (error) {
            console.log(error);    
        } 
    }

    const checkIfTransactionsExist = async() =>{
        try {
            const transactionsContract = createEthereumContract();
            const transactionsCount = await transactionsContract.getTransactionCount();
            
            window.localStorage.setItem("transactionCount" , transactionCount);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    },[]);

    const connectWallet = async () =>{
        try{
            if(!ethereum) return alert("Please Install maetamask");
            const account = await ethereum.request({method : 'eth_requestAccounts'});

            setConnectedAccount(account[0]);
        }
        catch(error){
            console.log(error);
        }
    }
    
    const sendTransaction = async () => {
        try {
          if (ethereum) {
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = createEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: connectedAccount,
                to: addressTo,
                gas: "0x5208",
                value: parsedAmount._hex,
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
    
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
    
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            setTransactionCount(transactionsCount.toNumber());
            
          } else {
            console.log("No ethereum object");
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    return(
        <TransactionContext.Provider value ={{connectWallet , connectedAccount, formData, setFormData, handleChange,sendTransaction,transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    );
}