import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ToppingSelector from "@/components/ToppingSelector";
import styles from "@/styles/Pizza.module.css";

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
                console.error(error.message);
            }
        };

        fetchPizzaDetails();
    }, [id]);

    const toggleTopping = (topping) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((item) => item !== topping)
                : [...prev, topping]
        );
    };

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
            console.error(error.message);
            alert("Failed to save toppings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Pizza: {pizzaName}</h1>
            <h2>Available Toppings</h2>
            <ToppingSelector
                toppings={availableToppings}
                selectedToppings={selectedToppings}
                onToggle={toggleTopping}
            />
            <h2>Selected Toppings</h2>
            <ul className={styles.selectedToppingList}>
                {selectedToppings.map((topping) => (
                    <li key={topping} className={styles.selectedToppingItem}>
                        {topping}
                    </li>
                ))}
            </ul>
            <button onClick={saveToppings} className={styles.saveButton} disabled={loading}>
                {loading ? "Saving..." : "Save Toppings"}
            </button>
            <button onClick={() => router.push("/")} className={styles.backButton}>
                Go Back
            </button>
        </div>
    );
}
