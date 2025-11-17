import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, "../products.json")

router.get("/home", (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
    res.render("home", { products });
});
router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

router.get("/", (req, res) => {
    res.redirect("/home");
});
export default router;