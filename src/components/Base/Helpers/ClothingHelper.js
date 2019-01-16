export default class ClothingHelper {
    static getDesignerUrl(product) {
        return `/designers/${product.designer}/${product.clothing_label.id}`;
    }

    static getCategoryUrl(category) {
        return `/search/products/${category.toLowerCase()}`;
    }

    static formatPrice(price) {
        return `$${price}`;
    }
}
