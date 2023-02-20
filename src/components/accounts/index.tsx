import { useEffect, useState } from "react";
import { AccountItem } from "./item";
import "./index.css";

import { Account } from "../../../types";
import { Error } from "../error";
import axios from "axios";

export const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts");
        setAccounts(response.data);
      }catch(error){
        console.error(error);
        setError(true);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <>
      <h1 className="align-left">Your accounts</h1>
      { error ? (
        <Error objectName="Accounts" />
      ) : (
        <div className="accounts">
          {accounts.map((account: Account) => (
            <AccountItem account={account} key={account.account_id} />
          ))}
        </div>
      )}
    </>
  );
};
