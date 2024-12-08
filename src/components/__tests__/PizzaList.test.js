import { render, screen, fireEvent } from "@testing-library/react";
import PizzaList from "../PizzaList";
import '@testing-library/jest-dom';

describe("PizzaList", () => {
    const pizzas = [
        { id: 1, name: "Pepperoni" },
        { id: 2, name: "Hawaiian" },
    ];
    const onManage = jest.fn();
    const onDelete = jest.fn();

    it("renders the pizza list correctly when pizzas are present", () => {
        render(<PizzaList pizzas={pizzas} onManage={onManage} onDelete={onDelete} />);

        expect(screen.getByText("Pepperoni")).toBeInTheDocument();
        expect(screen.getByText("Hawaiian")).toBeInTheDocument();
    });

    it("calls onManage with the correct pizza id", () => {
        render(<PizzaList pizzas={pizzas} onManage={onManage} onDelete={onDelete} />);

        fireEvent.click(screen.getAllByRole("button", { name: /Manage/i })[0]);
        expect(onManage).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getAllByRole("button", { name: /Manage/i })[1]);
        expect(onManage).toHaveBeenCalledWith(2);
    });

    it("calls onDelete with the correct pizza id", () => {
        render(<PizzaList pizzas={pizzas} onManage={onManage} onDelete={onDelete} />);

        fireEvent.click(screen.getAllByRole("button", { name: /Delete/i })[0]);
        expect(onDelete).toHaveBeenCalledWith(1);
    });

    it("renders no pizzas message if pizzas array is empty", () => {
        render(<PizzaList pizzas={[]} onManage={onManage} onDelete={onDelete} />);

        // You might want to add a specific element or text to indicate "no pizzas" in your component
        // and then assert its presence here. For example:
        // expect(screen.getByText("No pizzas available")).toBeInTheDocument();
    });

});