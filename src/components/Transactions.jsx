import React , {useContext} from "react";

import {TransactionContext} from '../context/TransactionsContext';
import dummyData from '../utils/dummyData'
import {shortenAddress} from '../utils/shortenAddress';

const TransactionCard = ({addressFrom, timestamp , message , amount , url}) =>{
    return(
        <div className="bg-[#181918] m-4 flex flex-1
            2xl:min-w-[450px]
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col p-3 rounded-md
            ">
                <div className="flex flex-col item-center w-full mt-3">
                    <div className="w-full mb-6 p-2">
                        <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target="_blank">
                            <p className="text-white text-base">From:{shortenAddress(addressFrom)}</p>
                        </a>

                        
                        <p className="text-white text-base">Amount : {amount} ETH</p>
                        {message &&(
                            <>
                                <br/>
                                <p className="text-white text-base">Message :{message}</p>
                            </>
                        )}
                    </div>
                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
                </div>
        </div>

    )
}

const Transactions = ()=>{
    const {currentAccount,transactions} = useContext(TransactionContext);

    return(
        <div className = "flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className= "flex flex-wrap justify-center items-center mt-10">
                {transactions.reverse().map((transaction,i)=>(
                    <TransactionCard key={i} {...transaction} />
                ))}
            </div>
        </div>
    );
}

export default Transactions;
