import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    const [toppings, setToppings] = useState([]);
    const [newTopping, setNewTopping] = useState("");

    useEffect(() => {
        if (id) fetchToppings();
    }, [id]);

    const fetchToppings = async () => {
        const { data, error } = await supabase
            .from("toppings")
            .select("id, name")
            .eq("pizza_id", id);

        if (error) {
            console.error("Error fetching toppings:", error);
        } else {
            setToppings(data || []);
        }
    };

    const addTopping = async () => {
        if (!newTopping.trim()) return;

        // Prevent duplicates
        const duplicate = toppings.some(
            (topping) => topping.name.toLowerCase() === newTopping.trim().toLowerCase()
        );
        if (duplicate) {
            alert("Topping already exists!");
            return;
        }

        const { data, error } = await supabase
            .from("toppings")
            .insert([{ name: newTopping.trim(), pizza_id: id }]);

        if (error) {
            console.error("Error adding topping:", error);
        } else {
            setToppings([...toppings, ...data]);
            setNewTopping("");
        }
    };

    const deleteTopping = async (toppingId) => {
        const { error } = await supabase.from("toppings").delete().eq("id", toppingId);
        if (error) {
            console.error("Error deleting topping:", error);
        } else {
            setToppings(toppings.filter((topping) => topping.id !== toppingId));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Manage Toppings</h1>

            <div className={styles.addToppingContainer}>
                <input
                    type="text"
                    placeholder="Enter topping"
                    value={newTopping}
                    onChange={(e) => setNewTopping(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addTopping} className={styles.addButton}>
                    Add Topping
                </button>
            </div>

            <ul className={styles.toppingList}>
                {toppings.map((topping) => (
                    <li key={topping.id} className={styles.toppingItem}>
                        {topping.name}
                        <button
                            onClick={() => deleteTopping(topping.id)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <button onClick={() => router.push("/")} className={styles.backButton}>
                Go Back
            </button>
        </div>
    );
}
