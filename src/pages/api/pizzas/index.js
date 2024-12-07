import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Fetch all pizzas
        const { data, error } = await supabase.from("pizzas").select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
        const { name } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Invalid pizzas name" });
        }

        // Add a new pizzas
        const { data, error } = await supabase.from("pizzas").insert({ name }).select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data || []);
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
