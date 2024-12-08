import { useState, useEffect } from "react";
import { fetchPizzas, addPizza, deletePizza } from "@/lib/apiUtils";

export default function usePizzas() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPizzas = async () => {
            const data = await fetchPizzas();
            setPizzas(data);
        };

        loadPizzas();
    }, []);

    const addNewPizza = async (name) => {
        setLoading(true);
        const newPizza = await addPizza(name);
        if (newPizza) setPizzas((prev) => [...prev, ...newPizza]);
        setLoading(false);
    };

    const removePizza = async (id) => {
        if (await deletePizza(id)) {
            setPizzas((prev) => prev.filter((pizza) => pizza.id !== id));
        }
    };

    return { pizzas, loading, addNewPizza, removePizza };
}
