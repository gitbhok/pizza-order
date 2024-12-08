import { renderHook, act } from "@testing-library/react";
import useToppings from "../useToppings";

describe("useToppings", () => {
    const pizzaId = 1;

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ selectedToppings: ["Pepperoni"] }),
            })
        );
    });

    afterEach(() => {
        global.fetch.mockClear(); // Or jest.clearAllMocks() if mocking multiple things
    });

    it("fetches toppings when pizzaId is provided", async () => {
        renderHook(() => useToppings(pizzaId));
        expect(global.fetch).toHaveBeenCalledWith(`/api/pizzas/${pizzaId}`);
    });

    it("does not fetch toppings when pizzaId is not present", async () => {
        renderHook(() => useToppings(undefined));
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("toggles a topping", () => {
        const { result } = renderHook(() => useToppings(pizzaId));

        act(() => {
            result.current.toggleTopping("Mushrooms");
        });
        expect(result.current.selectedToppings).toEqual(["Pepperoni", "Mushrooms"]);

        act(() => {
            result.current.toggleTopping("Pepperoni");
        });
        expect(result.current.selectedToppings).toEqual(["Mushrooms"]);

    });

    it("saves toppings", async () => {
        const { result } = renderHook(() => useToppings(pizzaId));
        act(() => {
            result.current.toggleTopping("Mushrooms");
        });

        await act(async () => {
            await result.current.saveToppings();
        });

        expect(global.fetch).toHaveBeenCalledWith(`/api/pizzas/${pizzaId}/toppings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedToppings: ["Pepperoni", "Mushrooms"] }),
        });
    });

    it("handles topping fetch errors", async () => {

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.reject(new Error('API Error')),
                status: 500, // Add a status code
                statusText: 'Internal Server Error' // Add a status text
            })
        );

        const { result } = renderHook(() => useToppings(pizzaId));

        // Wait for the effect to resolve (or reject)
        await act(async () => {
            await Promise.resolve(); // or await waitForNextUpdate(); in newer versions of react-testing-library
        });

        expect(result.current.selectedToppings).toEqual([]);
    });

    it("sets loading state correctly", async () => {

        const { result, waitForNextUpdate } = renderHook(() => useToppings(pizzaId));
        expect(result.current.loading).toBe(false); // Initial loading state

        act(async () => {
            result.current.saveToppings(); // Simulate save action
        });

        expect(result.current.loading).toBe(true); // Loading state during save

        await waitForNextUpdate();
        expect(result.current.loading).toBe(false); // Loading state after save

    });




});