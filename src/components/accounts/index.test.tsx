import { render, screen } from "@testing-library/react";
import axios from "axios";
import { Accounts } from ".";
import { accounts as mockAccounts} from "../../api/data/accounts";

jest.mock("axios");

describe("Accounts component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders accounts when no error occurred", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockAccounts });

    render(<Accounts />);

    expect(await screen.findByText("Your accounts")).toBeInTheDocument();
    expect(await screen.queryByText("An error has occured when fetching Accounts")).not.toBeInTheDocument();
    expect(await screen.findByText("Total GBP")).toBeInTheDocument();
    expect(await screen.findByText("Total EUR")).toBeInTheDocument();
    expect(await screen.findByText("Total USD")).toBeInTheDocument();
  });

  test("renders error message when an error occurred", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<Accounts />);

    expect(await screen.findByText("Your accounts")).toBeInTheDocument();
    expect(await screen.findByText("An error has occured when fetching Accounts")).toBeInTheDocument();
    expect(await screen.queryByText("Total GBP")).not.toBeInTheDocument();
    expect(await screen.queryByText("Total EUR")).not.toBeInTheDocument();
    expect(await screen.queryByText("Total USD")).not.toBeInTheDocument();
  });
});
