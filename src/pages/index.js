import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    const [pizzas, setPizzas] = useState([]);
    const [newPizzaName, setNewPizzaName] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch pizzas from API
    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await fetch("/api/pizzas");
                if (!response.ok) throw new Error("Failed to fetch pizzas");
                const data = await response.json();
                setPizzas(data || []);
            } catch (error) {
                console.error("Error fetching pizzas:", error.message);
            }
        };

        fetchPizzas();
    }, []);

    // Add a new pizzas
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

        try {
            const response = await fetch("/api/pizzas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newPizzaName }),
            });

            if (!response.ok) throw new Error("Failed to add pizzas");
            const newPizza = await response.json();
            setPizzas([...pizzas, ...newPizza]);
            setNewPizzaName("");
        } catch (error) {
            console.error("Error adding pizzas:", error.message);
            alert("Failed to add pizzas. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Delete a pizzas
    const deletePizza = async (id) => {
        try {
            const response = await fetch(`/api/pizzas/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete pizzas");
            setPizzas(pizzas.filter((pizza) => pizza.id !== id));
        } catch (error) {
            console.error("Error deleting pizzas:", error.message);
            alert("Failed to delete pizzas. Please try again.");
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
