import { useState, useEffect } from "react";

export default function useToppings(pizzaId) {
    const [availableToppings] = useState([
        "Pepperoni",
        "Mushrooms",
        "Onions",
        "Sausage",
        "Bacon",
        "Extra Cheese",
    ]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchToppings = async () => {
            if (!pizzaId) return;

            try {
                const response = await fetch(`/api/pizzas/${pizzaId}`);
                if (!response.ok) throw new Error("Failed to fetch pizza details");
                const data = await response.json();
                setSelectedToppings(data.selectedToppings || []);
            } catch (error) {
                console.error("Error fetching toppings:", error.message);
            }
        };

        fetchToppings();
    }, [pizzaId]);

    const toggleTopping = (topping) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((item) => item !== topping)
                : [...prev, topping]
        );
    };

    const saveToppings = async () => {
        if (!pizzaId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/pizzas/${pizzaId}/toppings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedToppings }),
            });

            if (!response.ok) throw new Error("Failed to save toppings");
            alert("Toppings saved successfully!");
        } catch (error) {
            console.error("Error saving toppings:", error.message);
            alert("Failed to save toppings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { availableToppings, selectedToppings, toggleTopping, saveToppings, loading };
}