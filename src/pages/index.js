import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    const [pizzas, setPizzas] = useState([]);
    const [unsavedPizzas, setUnsavedPizzas] = useState([]);
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

    // Add unsaved pizza
    const addUnsavedPizza = () => {
        if (!newPizzaName.trim()) {
            alert("Pizza name cannot be empty!");
            return;
        }
        if (
            pizzas.some((pizza) => pizza.name === newPizzaName) ||
            unsavedPizzas.some((pizza) => pizza.name === newPizzaName)
        ) {
            alert("Pizza name must be unique!");
            return;
        }
        setUnsavedPizzas([
            ...unsavedPizzas,
            { id: Date.now().toString(), name: newPizzaName },
        ]);
        setNewPizzaName("");
    };

    // Save all pizzas to Supabase
    const saveAllPizzas = async () => {
        setLoading(true);

        const { error } = await supabase.from("pizzas").insert(unsavedPizzas);
        if (error) {
            console.error("Error saving pizzas:", error.message);
        } else {
            setPizzas([...pizzas, ...unsavedPizzas]);
            setUnsavedPizzas([]);
            alert("Pizzas saved successfully!");
        }

        setLoading(false);
    };

    // Delete a pizza
    const deletePizza = async (id, isUnsaved) => {
        if (isUnsaved) {
            setUnsavedPizzas(unsavedPizzas.filter((pizza) => pizza.id !== id));
        } else {
            const { error } = await supabase.from("pizzas").delete().eq("id", id);
            if (error) {
                console.error("Error deleting pizza:", error.message);
            } else {
                setPizzas(pizzas.filter((pizza) => pizza.id !== id));
            }
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
                <button onClick={addUnsavedPizza} className={styles.addButton}>
                    Add Pizza
                </button>
            </div>

            <h2>Pizza List</h2>
            <ul className={styles.pizzaList}>
                {pizzas.map((pizza) => (
                    <li key={pizza.id} className={styles.pizzaItem}>
            <span onClick={() => router.push(`/pizza/${pizza.id}`)}>
              {pizza.name}
            </span>
                        <button onClick={() => deletePizza(pizza.id, false)}>Delete</button>
                    </li>
                ))}
                {unsavedPizzas.map((pizza) => (
                    <li key={pizza.id} className={styles.pizzaItem}>
                        <span>{pizza.name}</span>
                        <button onClick={() => deletePizza(pizza.id, true)}>Delete</button>
                    </li>
                ))}
            </ul>

            <button
                onClick={saveAllPizzas}
                className={styles.saveButton}
                disabled={loading || unsavedPizzas.length === 0}
            >
                {loading ? "Saving..." : "Save All"}
            </button>
        </div>
    );
}
