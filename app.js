import express from "express";
import handlebars from "express-handlebars"
import productsRouter from "./src/routes/products.router.js";
import cartRouter from "./src/routes/cart.router.js";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import viewsRouter from "./src/routes/views.router.js"
import ProductManager from "./src/manager/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);
app.use("/api/cart", cartRouter);
app.use(express.json());

//Servidor Http
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor Corriendo  en puerto${PORT}`));




const io = new Server(httpServer);
let products = [];

const productsPath = path.join(__dirname, "products.json");
if (fs.existsSync(productsPath)) {
  products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
}

//Conexión Web socket
io.on("connection", (socket) => {
  console.log("Cliente conectado via WebSocket♥");

  //Enviar Lista Inicial
  socket.emit("productosActualizados", products);

  //Agregar Productos
  socket.on("newProduct", (data) => {
    const newProduct = {
      id: Date.now().toString(),
      ...data
    };
    products.push(newProduct);

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    io.emit("productosActualizados", products);
  });

  //Eliminar
  socket.on("deleteProduct", (id) => {
    products = products.filter((p) => p.id !== id);


    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    io.emit("productosActualizados", products);
  });

})






