import Product from "../entity/product";

export default class ProductService {
    static increasePrice(products: Product[], percentage: number) {
        products.forEach(product => {
            const increasedPrice = product.price * (1 + percentage / 100);
            product.changePrice(increasedPrice);
        })
    }
}