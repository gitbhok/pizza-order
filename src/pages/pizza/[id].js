import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    // Predefined list of 6 available toppings
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

    useEffect(() => {
        if (id) {
            fetchSelectedToppings();
        }
    }, [id]);

    // Fetch selected toppings for this pizza from Supabase
    const fetchSelectedToppings = async () => {
        const { data, error } = await supabase
            .from("pizza_toppings")
            .select("topping")
            .eq("pizza_id", id);

        if (error) {
            console.error("Error fetching toppings:", error);
        } else if (data) {
            setSelectedToppings(data.map((item) => item.topping));
        }
    };

    // Update toppings in Supabase
    const saveToppingsToDatabase = async () => {
        // Delete existing toppings for this pizza
        const { error: deleteError } = await supabase
            .from("pizza_toppings")
            .delete()
            .eq("pizza_id", id);

        if (deleteError) {
            console.error("Error deleting existing toppings:", deleteError);
            return;
        }

        // Insert new toppings
        const { error: insertError } = await supabase
            .from("pizza_toppings")
            .insert(
                selectedToppings.map((topping) => ({
                    pizza_id: id,
                    topping,
                }))
            );

        if (insertError) {
            console.error("Error saving toppings:", insertError);
            alert("Failed to save toppings. Please try again.");
        } else {
            alert("Toppings saved successfully!");
        }
    };

    // Toggle topping selection
    const toggleTopping = (topping) => {
        if (selectedToppings.includes(topping)) {
            setSelectedToppings(
                selectedToppings.filter((item) => item !== topping)
            );
        } else {
            setSelectedToppings([...selectedToppings, topping]);
        }
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

            <button onClick={saveToppingsToDatabase} className={styles.saveButton}>
                Save Toppings
            </button>

            <button onClick={() => router.push("/")} className={styles.backButton}>
                Go Back
            </button>
        </div>
    );
}
