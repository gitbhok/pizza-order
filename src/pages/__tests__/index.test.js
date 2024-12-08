import { render, screen, fireEvent, act } from "@testing-library/react";
import Home from "../index";
import { useRouter } from "next/router";
import usePizzas from "@/hooks/usePizzas";

// Mock useRouter and usePizzas
jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../hooks/usePizzas"); // Mocking usePizzas

describe("Home Page", () => {
    beforeEach(() => {
        usePizzas.mockReturnValue({
            pizzas: [{ id: 1, name: "Test Pizza" }],
            loading: false,
            addNewPizza: jest.fn(),
            removePizza: jest.fn(),
        });

        useRouter.mockReturnValue({
            push: jest.fn(),
        });
    });

    afterEach(() => {
        usePizzas.mockClear(); // Reset usePizzas mock
        useRouter.mockClear(); // Reset useRouter mock
    });



    it("renders the pizza list", () => {
        render(<Home />);
        expect(screen.getByText("Test Pizza")).toBeInTheDocument();
    });

    it("navigates to the manage page", () => {

        render(<Home />);
        fireEvent.click(screen.getByRole("button", { name: /Manage/i }));

        expect(useRouter().push).toHaveBeenCalledWith("/pizza/1");
    });

    // ... more tests to come



});