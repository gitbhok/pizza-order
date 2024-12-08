export const fetchPizzas = async () => {
    try {
        const response = await fetch("/api/pizzas");
        if (!response.ok) throw new Error("Failed to fetch pizzas");
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

export const addPizza = async (name) => {
    try {
        const response = await fetch("/api/pizzas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error("Failed to add pizza");
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const deletePizza = async (id) => {
    try {
        const response = await fetch(`/api/pizzas/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete pizza");
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};
