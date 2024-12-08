import { render, screen, fireEvent } from "@testing-library/react";
import PizzaForm from "../PizzaForm";

describe("PizzaForm", () => {
    it("renders the form elements correctly", () => {
        render(<PizzaForm onAddPizza={() => {}} loading={false} />);
        expect(screen.getByPlaceholderText("Pizza Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Add Pizza/i })).toBeInTheDocument();
    });

    it("calls onAddPizza with the pizza name when the form is submitted", async () => {
        const onAddPizzaMock = jest.fn();
        render(<PizzaForm onAddPizza={onAddPizzaMock} loading={false} />);
        fireEvent.change(screen.getByPlaceholderText("Pizza Name"), {
            target: { value: "Test Pizza" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Add Pizza/i }));

        expect(onAddPizzaMock).toHaveBeenCalledWith("Test Pizza");
    });

    it("displays an alert if pizza name is empty", () => {
        window.alert = jest.fn(); // Mock alert function

        const onAddPizza = jest.fn();
        render(<PizzaForm onAddPizza={onAddPizza} loading={false} />);
        const addButton = screen.getByRole("button", { name: "Add Pizza" });

        fireEvent.click(addButton); // Simulate click with empty pizza name

        expect(window.alert).toHaveBeenCalledWith("Pizza name cannot be empty!"); // Check if alert is called
        expect(onAddPizza).not.toHaveBeenCalled();
    });

    it("disables the button while loading", () => {
        render(<PizzaForm onAddPizza={() => {}} loading={true} />);

        expect(screen.getByRole("button", { name: /Adding.../i })).toBeDisabled();
    });

    it("clears the input field after adding a pizza", () => {
        const onAddPizzaMock = jest.fn();
        render(<PizzaForm onAddPizza={onAddPizzaMock} loading={false} />);

        const input = screen.getByPlaceholderText("Pizza Name");

        fireEvent.change(input, { target: { value: "New Pizza" } });
        fireEvent.click(screen.getByRole("button", { name: /Add Pizza/i }));

        expect(input.value).toBe(""); // input should be cleared

    });
});