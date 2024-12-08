import { renderHook, act } from "@testing-library/react";
import useToppings from "../useToppings";
import '@testing-library/jest-dom';

describe("useToppings", () => {
    const pizzaId = 1;

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ selectedToppings: ["Pepperoni"] }),
            })
        );

        global.alert = jest.fn();

        // Mock console.error to prevent it from cluttering the test output
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        // Restore console.error after each test
        console.error.mockRestore();
    });

    it("fetches toppings when pizzaId is provided", async () => {
        await act(async () => {
            renderHook(() => useToppings(pizzaId));
        });
        expect(global.fetch).toHaveBeenCalledWith(`/api/pizzas/${pizzaId}`);
    });

    it("does not fetch toppings when pizzaId is not present", async () => {
        await act(async () => {
            renderHook(() => useToppings(undefined));
        });
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("toggles a topping", async () => {
        const { result } = await act(async () =>
            renderHook(() => useToppings(pizzaId))
        );

        // Wait for initial fetch to complete
        await act(async () => {
            await Promise.resolve();
        });

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
        const { result } = await act(async () =>
            renderHook(() => useToppings(pizzaId))
        );

        // Wait for initial fetch to complete
        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            result.current.toggleTopping("Mushrooms");
        });

        await act(async () => {
            await result.current.saveToppings();
        });

        expect(global.fetch).toHaveBeenCalledWith(
            `/api/pizzas/${pizzaId}/toppings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedToppings: ["Pepperoni", "Mushrooms"] }),
            }
        );
    });

    it("handles topping fetch errors", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            })
        );

        const { result } = await act(async () =>
            renderHook(() => useToppings(pizzaId))
        );

        // Wait for the effect to resolve (or reject)
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.selectedToppings).toEqual([]);
    });

    it("sets loading state correctly", async () => {
        const { result } = renderHook(() => useToppings(pizzaId));

        // Wait for initial fetch to complete
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.loading).toBe(false);

        // Simulate save action
        act(() => {
            result.current.saveToppings();
        });

        expect(result.current.loading).toBe(true);

        // Wait for save to complete
        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.loading).toBe(false);
    });
});