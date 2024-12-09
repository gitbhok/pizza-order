import { render, screen, fireEvent } from "@testing-library/react";
import ToppingSelector from "@/components/ToppingSelector";
import '@testing-library/jest-dom';

describe("ToppingSelector", () => {
    const toppings = ["Pepperoni", "Mushrooms", "Onions"];
    const selectedToppings = ["Pepperoni"];
    const onToggle = jest.fn();

    it("renders the available toppings correctly", () => {
        render(
            <ToppingSelector
                toppings={toppings}
                selectedToppings={selectedToppings}
                onToggle={onToggle}
            />
        );

        toppings.forEach((topping) => {
            expect(screen.getByText(topping)).toBeInTheDocument();
            expect(screen.getByLabelText(topping)).toBeInTheDocument(); //Ensure label is associated
        });
    });

    it("checks selected toppings", () => {
        render(
            <ToppingSelector
                toppings={toppings}
                selectedToppings={selectedToppings}
                onToggle={onToggle}
            />
        );
        expect(screen.getByLabelText("Pepperoni")).toBeChecked();
        expect(screen.getByLabelText("Mushrooms")).not.toBeChecked();
    });



    it("calls onToggle when a topping is clicked", () => {

        render(
            <ToppingSelector
                toppings={toppings}
                selectedToppings={selectedToppings}
                onToggle={onToggle}
            />
        );

        fireEvent.click(screen.getByLabelText("Mushrooms"));
        expect(onToggle).toHaveBeenCalledWith("Mushrooms");
    });



    it("renders no toppings message if toppings array is empty", () => {
        render(
            <ToppingSelector
                toppings={[]}
                selectedToppings={[]}
                onToggle={onToggle}
            />
        );
        // Assert for a message or element that indicates no toppings, if present in your component
    });
});