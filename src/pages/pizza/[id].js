import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../../styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    const availableToppings = [
        "Pepperoni",
        "Mushrooms",
        "Onions",
        "Sausage",
        "Bacon",
        "Extra Cheese",
    ];

    const [pizzaName, setPizzaName] = useState("");
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch pizza name and toppings from Supabase
    useEffect(() => {
        const fetchPizzaDetails = async () => {
            if (!id) return;

            const { data: pizza, error: pizzaError } = await supabase
                .from("pizzas")
                .select("name")
                .eq("id", id)
                .single();

            if (pizzaError) {
                console.error("Error fetching pizza:", pizzaError.message);
                return;
            }
            setPizzaName(pizza.name);

            const { data: toppings, error: toppingsError } = await supabase
                .from("pizza_toppings")
                .select("topping")
                .eq("pizza_id", id);

            if (toppingsError) {
                console.error("Error fetching toppings:", toppingsError.message);
                return;
            }
            setSelectedToppings(toppings.map((item) => item.topping));
        };

        fetchPizzaDetails();
    }, [id]);

    // Toggle topping selection
    const toggleTopping = (topping) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((item) => item !== topping)
                : [...prev, topping]
        );
    };

    // Save toppings
    const saveToppings = async () => {
        if (!id) return;

        setLoading(true);
        await supabase.from("pizza_toppings").delete().eq("pizza_id", id);

        const { error } = await supabase.from("pizza_toppings").insert(
            selectedToppings.map((topping) => ({
                pizza_id: id,
                topping,
            }))
        );

        if (error) {
            console.error("Error saving toppings:", error.message);
        } else {
            alert("Toppings saved successfully!");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1>Pizza: {pizzaName}</h1>

            <h2>Available Toppings</h2>
            <ul className={styles.toppingList}>
                {availableToppings.map((topping) => (
                    <li key={topping} className={styles.toppingItem}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedToppings.includes(topping)}
                                onChange={() => toggleTopping(topping)}
                            />
                            {topping}
                        </label>
                    </li>
                ))}
            </ul>

            <h2>Selected Toppings</h2>
            <ul className={styles.selectedToppingList}>
                {selectedToppings.map((topping) => (
                    <li key={topping} className={styles.selectedToppingItem}>
                        {topping}
                    </li>
                ))}
            </ul>

            <button
                onClick={saveToppings}
                className={styles.saveButton}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Toppings"}
            </button>

            <button onClick={() => router.push("/")} className={styles.backButton}>
                Go Back
            </button>
        </div>
    );
}
