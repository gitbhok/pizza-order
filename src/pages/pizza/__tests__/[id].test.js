import { render, screen, fireEvent, act } from "@testing-library/react";
import Pizza from "../[id]";
import { useRouter } from "next/router";
import useToppings from "@/hooks/useToppings";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../../hooks/useToppings");

describe("Dynamic Pizza Page", () => {

    beforeEach(() => {

        useRouter.mockReturnValue({
            query: { id: 1 },
            push: jest.fn(),
        });
        useToppings.mockReturnValue({
            availableToppings: ["Pepperoni", "Onions"],
            selectedToppings: [],
            toggleTopping: jest.fn(),
            saveToppings: jest.fn(),
            loading: false,
        });
    });

    afterEach(() => {

        useToppings.mockClear();
        useRouter.mockClear();
    });



    it("renders available toppings", () => {

        render(<Pizza />);
        expect(screen.getByText("Pepperoni")).toBeVisible();
        expect(screen.getByText("Onions")).toBeVisible();

    });



    it("toggles toppings correctly", () => {
        render(<Pizza />);

        fireEvent.click(screen.getByLabelText("Pepperoni"));
        expect(useToppings().toggleTopping).toHaveBeenCalledWith("Pepperoni");
    });



    it("saves toppings", async () => {
        render(<Pizza />);

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: /Save Toppings/i }));
        });

        expect(useToppings().saveToppings).toHaveBeenCalled();

    });



    it("navigates back to home page", () => {

        render(<Pizza />);
        fireEvent.click(screen.getByRole("button", { name: "Go Back" }));

        expect(useRouter().push).toHaveBeenCalledWith("/");

    });



    it("renders selected toppings", () => {
        useToppings.mockReturnValue({
            availableToppings: ["Pepperoni", "Onions"],
            selectedToppings: ["Pepperoni"],
            toggleTopping: jest.fn(),
            saveToppings: jest.fn(),
            loading: false,
        });

        render(<Pizza />);
        expect(screen.getByText("Pepperoni")).toBeVisible(); // in selected toppings

    });



    it("disables save button while loading", () => {

        useToppings.mockReturnValue({
            // ... other mock values
            loading: true,
        });
        render(<Pizza />);

        expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    });

});