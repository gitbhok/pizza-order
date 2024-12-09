import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { data, error } = await supabase.from("pizzas").select();
            if (error) throw error;
            res.status(200).json(data || []);
        } catch (error) {
            console.error("Error fetching pizzas:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === "POST") {
        const { name } = req.body;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Invalid pizza name" });
        }
        try {
            const { data, error } = await supabase.from("pizzas").insert({ name }).select();
            if (error) throw error;
            res.status(201).json(data || []);
        } catch (error) {
            console.error("Error adding pizza:", error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
