import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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

    // Fetch pizza details
    useEffect(() => {
        const fetchPizzaDetails = async () => {
            if (!id) return;

            try {
                const response = await fetch(`/api/pizzas/${id}`);
                if (!response.ok) throw new Error("Failed to fetch pizza details");

                const data = await response.json();
                setPizzaName(data.pizzaName);
                setSelectedToppings(data.selectedToppings);
            } catch (error) {
                console.error("Error fetching pizza details:", error.message);
            }
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

        try {
            const response = await fetch(`/api/pizzas/${id}/toppings`, {
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
