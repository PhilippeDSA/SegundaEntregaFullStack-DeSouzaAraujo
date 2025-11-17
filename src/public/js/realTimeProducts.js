const socket = io();

socket.on("productosActualizados", (products) => {
    const list = document.getElementById("productList");
    list.innerHTML = "";
    products.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title}-$${p.price}`;

        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.onclick = () => socket.emit("eliminarProducto", p.id);
        li.appendChild(btn);
        list.appendChild(li);

    });
});

document.getElementById("productForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const id = Date.now();

    socket.emit("nuevoProducto", { id, title, price });
    e.target.reset();

});

//Formulario para agregar♥
const form = document.getElementById("product");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    socket.emit("newProduct", { title, price });
    form.reset();
});
//Formulario para eliminar♥
const deleteForm = document.getElementById("deleteForm");
deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    socket.emit("eliminarProductos", id);
    deleteForm.reset();
});
//Recibir Lista Actualizada

socket.on("productsUpdated", (products) => {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `${p.tittle}- $${p.price}(ID:${p.id})`;
        list.appendChild(li);
    });
});