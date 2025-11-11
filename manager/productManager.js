import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
  }

  loadProducts() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(data);
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((p) => p.id === id);
  }

  addProduct({ title, description, code, price, status, stock, category, thumbnails = [] }) {
    const newProduct = {
      id: Date.now().toString(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates, id }; // no se cambia el id
    this.saveProducts();
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    this.saveProducts();
    return true;
  }
}
