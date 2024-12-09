import { useRouter } from "next/router";
import useToppings from "@/hooks/useToppings";
import ToppingSelector from "@/components/ToppingSelector";
import styles from "@/styles/Pizza.module.css";

export default function PizzaPage() {
    const router = useRouter();
    const { id } = router.query;

    const {
        availableToppings,
        selectedToppings,
        toggleTopping,
        saveToppings,
        loading,
    } = useToppings(id);

    return (
        <div className={styles.container}>
            <h1>Pizza Details</h1>
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
            <button
                onClick={saveToppings}
                className={styles.saveButton}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Toppings"}
            </button>
            <button
                onClick={() => router.push("/")}
                className={styles.backButton}
            >
                Go Back
            </button>
        </div>
    );
}
