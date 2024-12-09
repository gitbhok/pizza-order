import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/pages";
import { useRouter } from "next/router";
import usePizzas from "@/hooks/usePizzas";
import '@testing-library/jest-dom';

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

});