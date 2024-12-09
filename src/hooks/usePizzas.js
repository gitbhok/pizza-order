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
        const trimmedName = name.trim();

        if (!trimmedName) {
            alert("Pizza name cannot be empty!");
            return;
        }

        if (pizzas.some(pizza => pizza.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert("A pizza with that name already exists!");
            return;
        }

        setLoading(true);
        try {
            const newPizza = await addPizza(trimmedName);
            if (newPizza) {
                setPizzas((prev) => [...prev, ...newPizza]);
            }
        } finally {
            setLoading(false);
        }
    };

    const removePizza = async (id) => {
        if (await deletePizza(id)) {
            setPizzas((prev) => prev.filter((pizza) => pizza.id !== id));
        }
    };

    return { pizzas, loading, addNewPizza, removePizza };
}