import styles from "@/styles/Home.module.css";

export default function PizzaList({ pizzas, onManage, onDelete }) {
    return (
        <ul className={styles.pizzaList}>
            {pizzas.map((pizza) => (
                <li key={pizza.id} className={styles.pizzaItem}>
                    <span className={styles.pizzaName}>{pizza.name}</span>
                    <div className={styles.pizzaActions}>
                        <button
                            onClick={() => onManage(pizza.id)}
                            className={styles.manageButton}
                        >
                            Manage
                        </button>
                        <button
                            onClick={() => onDelete(pizza.id)}
                            className={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
