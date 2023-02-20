import { useEffect, useState } from "react";

import * as Tabs from "@radix-ui/react-tabs";
import { Transaction as TransactionType } from "../../../types";
import "./index.css";
import { Transaction } from "./item";
import { Loading } from "../loading";
import { Error } from "../error";
import axios from "axios";

const isExpense = (transaction: TransactionType) => transaction.amount.value < 0;
const isIncome = (transaction: TransactionType) => transaction.amount.value > 0;

type Props = {
  transactions: TransactionType[]
}

const Expenses = ({transactions}: Props) => {
  return (
    <table aria-label="Expenses">
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.filter(isExpense).map((transaction) => (
          <Transaction transaction={transaction} key={transaction.id} />
        ))}
      </tbody>
    </table>
  );
};

const Income = ({transactions}: Props) => {
  return (
    <table aria-label="Income">
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.filter(isIncome).map((transaction) => (
          <Transaction transaction={transaction} key={transaction.id} />
        ))}
      </tbody>
    </table>
  );
};

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/transactions");
        setTransactions(response.data);
      }catch(error){
        console.error(error);
        setError(true);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  return (
    <>
      <h1 className="align-left">Transaction History</h1>      
      {
        error ? (
          <Error objectName="Transactions" />
        ) : (
          <Tabs.Root defaultValue="expenses" className="flow">
            <Tabs.List className="tabs__list" aria-label="Filter your transactions">
              <Tabs.Trigger value="expenses">Expenses</Tabs.Trigger>
              <Tabs.Trigger value="income">Income</Tabs.Trigger>
            </Tabs.List>

            {loading ? (
              <Loading />
            ) : (
              <>
              <Tabs.Content className="TabsContent" value="expenses">
                <Expenses transactions={transactions} />
              </Tabs.Content>
              <Tabs.Content className="TabsContent" value="income">
                <Income transactions={transactions} />
              </Tabs.Content>
              </>
            )}
          </Tabs.Root>
        )
      }
    </>
  );
};
