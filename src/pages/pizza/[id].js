import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../../styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    // Predefined list of available toppings
    const availableToppings = [
        "Pepperoni",
        "Mushrooms",
        "Onions",
        "Sausage",
        "Bacon",
        "Extra Cheese",
    ];

    // State to manage selected toppings
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch selected toppings for the pizza from Supabase
    useEffect(() => {
        const fetchToppings = async () => {
            if (!id) return;

            setLoading(true);
            const { data, error } = await supabase
                .from("pizza_toppings")
                .select("topping")
                .eq("pizza_id", id);

            if (error) {
                console.error("Error fetching toppings:", error.message);
            } else if (data) {
                setSelectedToppings(data.map((item) => item.topping));
            }
            setLoading(false);
        };

        fetchToppings();
    }, [id]);

    // Toggle topping selection
    const toggleTopping = (topping) => {
        if (selectedToppings.includes(topping)) {
            setSelectedToppings(selectedToppings.filter((item) => item !== topping));
        } else {
            setSelectedToppings([...selectedToppings, topping]);
        }
    };

    // Save toppings to Supabase
    const saveToppings = async () => {
        if (!id) return;

        setLoading(true);

        // Delete existing toppings for this pizza
        const { error: deleteError } = await supabase
            .from("pizza_toppings")
            .delete()
            .eq("pizza_id", id);

        if (deleteError) {
            console.error("Error deleting old toppings:", deleteError.message);
            setLoading(false);
            return;
        }

        // Insert updated toppings
        const newToppings = selectedToppings.map((topping) => ({
            pizza_id: id,
            topping,
        }));
        const { error: insertError } = await supabase
            .from("pizza_toppings")
            .insert(newToppings);

        if (insertError) {
            console.error("Error saving toppings:", insertError.message);
        } else {
            alert("Toppings saved successfully!");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1>Pizza: {id}</h1>

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
            {selectedToppings.length > 0 ? (
                <ul className={styles.selectedToppingList}>
                    {selectedToppings.map((topping) => (
                        <li key={topping} className={styles.selectedToppingItem}>
                            {topping}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No toppings selected.</p>
            )}

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
