import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { TransactionHistory } from ".";
import { transactions as mockTransactions } from "../../api/data/transactions";
import userEvent from "@testing-library/user-event";

import axios from "axios";

jest.mock("axios");

describe("transaction history", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    (axios.get as jest.Mock).mockResolvedValue({ data: mockTransactions });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders loader when fetching transactions", async () => {
    render(<TransactionHistory />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders an error message when fetching transactions fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network Error..."));
    render(<TransactionHistory />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => 
      expect(screen.getByText("An error has occured when fetching Transactions")).toBeInTheDocument()
    );
  });

  test("hides loader after transactions are fetched and the expenses tab should be shown by default", async () => {
    render(<TransactionHistory />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

    expect(screen.getByText("Transaction History")).toBeInTheDocument();

    const expensesTabTrigger = screen.getByRole("tab", {
      name: "Expenses",
    });

    expect(expensesTabTrigger).toHaveAttribute("data-state", "active");

    const expensesTable = screen.getByRole("table", {
      name: "Expenses",
    });

    expect(expensesTable).toBeInTheDocument();
    expect(await screen.findByText("€ -20.25")).toBeInTheDocument();
  });

  test("changing between the expenses and income tabs should show different transactions", async () => {
    render(<TransactionHistory />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  
    await waitFor(() => expect(screen.getByText("Transaction History")).toBeInTheDocument());
  
    const expensesTabTrigger = screen.getByRole("tab", {
      name: "Expenses",
    });
    const incomeTabTrigger = screen.getByRole("tab", {
      name: "Income",
    });
    const expensesTable = screen.getByRole("table", {
      name: "Expenses",
    });
    const incomeTable = screen.queryByRole("table", {
      name: "Income",
    });

    expect(expensesTable).toBeInTheDocument();
    expect(screen.queryByText("€ -20.25")).toBeInTheDocument();
    expect(incomeTable).not.toBeInTheDocument();

    userEvent.click(incomeTabTrigger);
    
    await waitFor(() => expect(incomeTabTrigger).toHaveAttribute("data-state", "active"));
    expect(expensesTabTrigger).toHaveAttribute("data-state", "inactive");
    expect(screen.queryByText("€ -20.25")).not.toBeInTheDocument();
  });

});
