import { renderHook, act } from "@testing-library/react";
import usePizzas from "../usePizzas";

// Mock the apiUtils functions
const mockFetchPizzas = jest.fn();
const mockAddPizza = jest.fn();
const mockDeletePizza = jest.fn();

jest.mock("../../lib/apiUtils", () => ({
    fetchPizzas: () => mockFetchPizzas(),
    addPizza: (name) => mockAddPizza(name),
    deletePizza: (id) => mockDeletePizza(id)
}));

describe("usePizzas", () => {

    beforeEach(() => {
        mockFetchPizzas.mockResolvedValue([{ id: 1, name: "Test Pizza" }]);
        mockAddPizza.mockResolvedValue([{id: 2, name: "New Pizza"}]);
        mockDeletePizza.mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks
    });

    it("fetches pizzas on mount", async () => {
        renderHook(() => usePizzas());
        expect(mockFetchPizzas).toHaveBeenCalledTimes(1);
    });

    it("adds a new pizza", async () => {
        const { result } = renderHook(() => usePizzas());

        await act(async () => {
            await result.current.addNewPizza("New Pizza");
        });

        expect(mockAddPizza).toHaveBeenCalledWith("New Pizza");
        expect(result.current.pizzas).toContainEqual({ id: 2, name: "New Pizza" });

    });

    it("removes a pizza", async () => {

        const { result } = renderHook(() => usePizzas());

        await act(async () => {
            await result.current.removePizza(1);
        });

        expect(mockDeletePizza).toHaveBeenCalledTimes(1);
        expect(mockDeletePizza).toHaveBeenCalledWith(1);
        expect(result.current.pizzas).toEqual([]);
    });

    it("handles errors when adding a pizza", async () => {
        mockAddPizza.mockRejectedValue(new Error("Failed to add pizza"));
        const { result } = renderHook(() => usePizzas());

        await act(async () => {
            await result.current.addNewPizza("Error Pizza");
        });

        expect(result.current.pizzas).not.toContainEqual({
            id: 2,
            name: "Error Pizza",
        });
    });

    it("handles errors during pizza deletion", async () => {
        mockDeletePizza.mockRejectedValueOnce(new Error("Failed to delete pizza"));
        const { result } = renderHook(() => usePizzas());

        await act(async () => {
            await result.current.removePizza(1);
        });

        expect(result.current.pizzas).toEqual([{ id: 1, name: "Test Pizza" }]);

    });

    it("sets loading state correctly", async () => {

        const { result, waitForNextUpdate } = renderHook(() => usePizzas());
        expect(result.current.loading).toBe(false);

        act(async () => {
            result.current.addNewPizza('New Pizza');
        });

        expect(result.current.loading).toBe(true);

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);

    });




});