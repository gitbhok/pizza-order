import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const { data: pizza, error: pizzaError } = await supabase
                .from("pizzas")
                .select("name")
                .eq("id", id)
                .single();

            if (pizzaError) throw pizzaError;

            const { data: toppings, error: toppingsError } = await supabase
                .from("pizza_toppings")
                .select("topping")
                .eq("pizza_id", id);

            if (toppingsError) throw toppingsError;

            res.status(200).json({
                pizzaName: pizza.name,
                selectedToppings: toppings.map((topping) => topping.topping),
            });
        } catch (error) {
            console.error("Error fetching pizza:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === "DELETE") {
        try {
            const { error } = await supabase.from("pizzas").delete().eq("id", id);
            if (error) throw error;
            res.status(200).json({ message: "Pizza deleted successfully" });
        } catch (error) {
            console.error("Error deleting pizza:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["GET", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
