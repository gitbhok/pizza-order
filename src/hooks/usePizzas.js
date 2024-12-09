// /src/hooks/usePizzas.js
import { useState, useEffect } from "react";
import { fetchPizzas, addPizza, deletePizza } from "@/lib/apiUtils";
import { supabase } from "@/lib/supabaseClient";

export default function usePizzas() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPizzasWithToppings = async () => {
            const pizzasData = await fetchPizzas();

            // Fetch toppings for each pizza
            const pizzasWithToppings = await Promise.all(
                pizzasData.map(async (pizza) => {
                    const { data: toppingsData, error: toppingsError } = await supabase
                        .from("pizza_toppings")
                        .select("topping")
                        .eq("pizza_id", pizza.id);

                    if (toppingsError) {
                        console.error(
                            `Error fetching toppings for pizza ${pizza.id}:`,
                            toppingsError.message
                        );
                        return { ...pizza, toppings: [] };
                    }

                    return {
                        ...pizza,
                        toppings: toppingsData.map((topping) => topping.topping),
                    };
                })
            );

            setPizzas(pizzasWithToppings);
        };

        loadPizzasWithToppings();
    }, []);

    const addNewPizza = async (name) => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            alert("Pizza name cannot be empty!");
            return;
        }

        if (
            pizzas.some(
                (pizza) => pizza.name.toLowerCase() === trimmedName.toLowerCase()
            )
        ) {
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