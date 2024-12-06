import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import styles from "../styles/Home.module.css";

export default function Home() {
    const [pizzas, setPizzas] = useState([]);
    const [newPizzaName, setNewPizzaName] = useState("");
    const [unsavedPizzas, setUnsavedPizzas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchPizzas();
    }, []);

    const fetchPizzas = async () => {
        const { data, error } = await supabase.from("pizzas").select("id, name");
        if (error) {
            console.error("Error fetching pizzas:", error);
        } else {
            setPizzas(data || []);
        }
    };

    const addPizzaLocally = () => {
        if (!newPizzaName.trim()) return;

        const duplicate = [...pizzas, ...unsavedPizzas].some(
            (pizza) => pizza.name.toLowerCase() === newPizzaName.trim().toLowerCase()
        );

        if (duplicate) {
            alert("Pizza with this name already exists!");
            return;
        }

        setUnsavedPizzas((prevUnsavedPizzas) => [
            ...prevUnsavedPizzas,
            { id: Date.now(), name: newPizzaName.trim(), isUnsaved: true },
        ]);
        setNewPizzaName("");
    };

    const savePizzasToDatabase = async () => {
        if (unsavedPizzas.length === 0) {
            alert("No pizzas to save.");
            return;
        }

        const { error } = await supabase.from("pizzas").insert(
            unsavedPizzas.map((pizza) => ({ name: pizza.name }))
        );

        if (error) {
            console.error("Error saving pizzas:", error);
            alert("Failed to save pizzas. Please try again.");
        } else {
            setUnsavedPizzas([]); // Clear the unsaved pizzas
            alert("Pizzas saved successfully!");
            fetchPizzas(); // Refresh the list of pizzas
        }
    };

    const deletePizza = async (id, isUnsaved = false) => {
        if (isUnsaved) {
            // Remove unsaved pizza
            setUnsavedPizzas((prevUnsavedPizzas) =>
                prevUnsavedPizzas.filter((pizza) => pizza.id !== id)
            );
        } else {
            // Delete from database
            const { error } = await supabase.from("pizzas").delete().eq("id", id);
            if (error) {
                console.error("Error deleting pizza:", error);
            } else {
                fetchPizzas(); // Refresh the list of pizzas
            }
        }
    };

    const navigateToPizza = (pizza) => {
        if (pizza.isUnsaved) {
            alert(
                "This pizza is not yet saved to the database. Please save it before managing."
            );
        } else {
            router.push(`/pizza/${pizza.id}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Manage Pizzas</h1>

            {/* Add Pizza Locally */}
            <div className={styles.addPizzaContainer}>
                <input
                    type="text"
                    placeholder="Enter pizza name"
                    value={newPizzaName}
                    onChange={(e) => setNewPizzaName(e.target.value)}
                    className={styles.input}
                />
                <button onClick={addPizzaLocally} className={styles.addButton}>
                    Add Pizza Locally
                </button>
            </div>

            {/* Save Pizzas to Database */}
            <button
                onClick={savePizzasToDatabase}
                className={styles.saveButton}
                disabled={unsavedPizzas.length === 0}
            >
                Save All
            </button>

            {/* List of Existing Pizzas */}
            <h2>Existing Pizzas</h2>
            <ul className={styles.pizzaList}>
                {pizzas.map((pizza) => (
                    <li key={pizza.id} className={styles.pizzaItem}>
                        <div className={styles.pizzaDetails}>
                            <strong>{pizza.name}</strong>
                        </div>
                        <button
                            onClick={() => navigateToPizza(pizza)}
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
                    </li>
                ))}
            </ul>

            {/* Unsaved Pizzas */}
            {unsavedPizzas.length > 0 && (
                <>
                    <h2>Unsaved Pizzas</h2>
                    <ul className={styles.pizzaList}>
                        {unsavedPizzas.map((pizza) => (
                            <li key={pizza.id} className={styles.pizzaItem}>
                                <div className={styles.pizzaDetails}>
                                    <strong>{pizza.name}</strong>
                                </div>
                                <button
                                    onClick={() => navigateToPizza(pizza)}
                                    className={styles.manageButton}
                                >
                                    Manage
                                </button>
                                <button
                                    onClick={() => deletePizza(pizza.id, true)}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
