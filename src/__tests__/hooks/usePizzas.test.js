import { renderHook, act } from "@testing-library/react";
import usePizzas from "@/hooks/usePizzas";

// Mock the apiUtils functions
const mockFetchPizzas = jest.fn();
const mockAddPizza = jest.fn();
const mockDeletePizza = jest.fn();

jest.mock("../../lib/apiUtils", () => ({
    fetchPizzas: () => mockFetchPizzas(),
    addPizza: (name) => mockAddPizza(name),
    deletePizza: (id) => mockDeletePizza(id),
}));

// Mock supabaseClient
jest.mock("../../lib/supabaseClient", () => ({
    supabase: {
        from: () => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            then: jest.fn(),
        }),
    },
}));

describe("usePizzas", () => {
    beforeEach(() => {
        mockFetchPizzas.mockResolvedValue([{ id: 1, name: "Test Pizza", toppings: []}]);
        mockAddPizza.mockResolvedValue([{ id: 2, name: "New Pizza" }]);
        mockDeletePizza.mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("fetches pizzas on mount", async () => {
        await act(async () => {
            renderHook(() => usePizzas());
        });
        expect(mockFetchPizzas).toHaveBeenCalledTimes(1);
    });

    it("adds a new pizza", async () => {
        const { result } = renderHook(() => usePizzas());

        await act(async () => {
            await result.current.addNewPizza("New Pizza");
        });

        expect(mockAddPizza).toHaveBeenCalledWith("New Pizza");
        expect(result.current.pizzas).toContainEqual({
            id: 2,
            name: "New Pizza",
        });
    });

    it("removes a pizza", async () => {
        // You need to have a pizza in the state before removing
        mockFetchPizzas.mockResolvedValueOnce([{ id: 1, name: "Test Pizza", toppings: [] }]);
        const { result } = renderHook(() => usePizzas());

        // Wait for the initial fetch to complete in the hook
        await act(async () => {
            await  Promise.resolve();
        });

        await act(async () => {
            await result.current.removePizza(1);
        });

        expect(mockDeletePizza).toHaveBeenCalledWith(1);
        expect(result.current.pizzas).not.toContainEqual({ id: 1, name: "Test Pizza", toppings: [] });
    });
});