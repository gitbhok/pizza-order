import { fetchPizzas, addPizza, deletePizza } from "../apiUtils";

describe("API Utils", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch.mockReset(); // Reset after each test
    });

    it("fetches pizzas successfully", async () => {
        const mockPizzas = [{ id: 1, name: "Test Pizza" }];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockPizzas,
        });

        const pizzas = await fetchPizzas();
        expect(pizzas).toEqual(mockPizzas);
        expect(global.fetch).toHaveBeenCalledWith("/api/pizzas");
    });

    it("handles fetch pizzas error", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => { throw new Error('Failed to fetch')},
        });

        const pizzas = await fetchPizzas();
        expect(pizzas).toEqual([]);

    });

    it("adds a pizza successfully", async () => {

        const newPizza = { id: 2, name: "New Pizza" };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => newPizza,
        });

        const pizza = await addPizza("New Pizza");

        expect(pizza).toEqual(newPizza);
        expect(global.fetch).toHaveBeenCalledWith("/api/pizzas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "New Pizza" }),
        });

    });

    it("handles add pizza error", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => { throw new Error('Failed to add')},
        });

        const pizza = await addPizza("New Pizza");
        expect(pizza).toEqual(null);
    });

    it("deletes a pizza successfully", async () => {

        global.fetch.mockResolvedValueOnce({ ok: true });

        const result = await deletePizza(1);
        expect(result).toEqual(true);
        expect(global.fetch).toHaveBeenCalledWith("/api/pizzas/1", {
            method: "DELETE",
        });
    });



    it("handles delete pizza error", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => { throw new Error('Failed to delete')},
        });

        const result = await deletePizza(1);

        expect(result).toBe(false);

    });

});