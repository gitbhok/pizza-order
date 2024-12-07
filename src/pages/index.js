import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    const [pizzas, setPizzas] = useState([]);
    const [newPizzaName, setNewPizzaName] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch pizzas from Supabase
    useEffect(() => {
        const fetchPizzas = async () => {
            const { data, error } = await supabase.from("pizzas").select();
            if (error) {
                console.error("Error fetching pizzas:", error.message);
            } else {
                setPizzas(data);
            }
        };

        fetchPizzas();
    }, []);

    // Add a new pizza directly to Supabase
    const addPizza = async () => {
        if (!newPizzaName.trim()) {
            alert("Pizza name cannot be empty!");
            return;
        }

        if (pizzas.some((pizza) => pizza.name === newPizzaName)) {
            alert("Pizza name must be unique!");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from("pizzas")
            .insert({ name: newPizzaName })
            .select(); // Fetch inserted data immediately

        if (error) {
            console.error("Error adding pizza:", error.message);
            alert("Failed to add pizza. Please try again.");
        } else if (data) {
            setPizzas([...pizzas, ...data]); // Add the new pizza to the list
            setNewPizzaName("");
        }

        setLoading(false);
    };

    // Delete a pizza
    const deletePizza = async (id) => {
        const { error } = await supabase.from("pizzas").delete().eq("id", id);
        if (error) {
            console.error("Error deleting pizza:", error.message);
            alert("Failed to delete pizza. Please try again.");
        } else {
            setPizzas(pizzas.filter((pizza) => pizza.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Manage Pizza</h1>
            <div className={styles.addPizzaContainer}>
                <input
                    type="text"
                    placeholder="Pizza Name"
                    value={newPizzaName}
                    onChange={(e) => setNewPizzaName(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addPizza} className={styles.addButton} disabled={loading}>
                    {loading ? "Adding..." : "Add Pizza"}
                </button>
            </div>

            <h2>Pizza List</h2>
            <ul className={styles.pizzaList}>
                {pizzas.map((pizza) => (
                    <li key={pizza.id} className={styles.pizzaItem}>
                        <span className={styles.pizzaName}>{pizza.name}</span>
                        <div className={styles.pizzaActions}>
                            <button
                                onClick={() => router.push(`/pizza/${pizza.id}`)}
                                className={styles.manageButton}
                            >
                                Manage
                            </button>
                            <button
                                onClick={() => deletePizza(pizza.id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
