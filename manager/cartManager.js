import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(this.path, "utf-8");
    return JSON.parse(data);
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newCart = { id: Date.now().toString(), products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find((c) => c.id === id);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find((p) => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    this.saveCarts();
    return cart;
  }
}
