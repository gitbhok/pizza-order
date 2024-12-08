import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PizzaList from "@/components/PizzaList";
import PizzaForm from "@/components/PizzaForm";
import { fetchPizzas, addPizza, deletePizza } from "@/lib/apiUtils";
import styles from "../styles/Home.module.css";

export default function Home() {
    const router = useRouter();
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await fetchPizzas();
            setPizzas(data);
        })();
    }, []);

    const handleAddPizza = async (name) => {
        setLoading(true);
        const newPizza = await addPizza(name);
        if (newPizza) setPizzas((prev) => [...prev, ...newPizza]);
        setLoading(false);
    };

    const handleDeletePizza = async (id) => {
        if (await deletePizza(id)) {
            setPizzas((prev) => prev.filter((pizza) => pizza.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Manage Pizzas</h1>
            <PizzaForm onAddPizza={handleAddPizza} loading={loading} />
            <PizzaList
                pizzas={pizzas}
                onManage={(id) => router.push(`/pizza/${id}`)}
                onDelete={handleDeletePizza}
            />
        </div>
    );
}
