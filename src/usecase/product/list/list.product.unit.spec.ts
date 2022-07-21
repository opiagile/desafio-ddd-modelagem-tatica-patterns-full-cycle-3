import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import { OutputListProductsDto } from "./list.product.dto";
import ListProductsUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product 1", 10) as Product;
const product2 = ProductFactory.create("a", "Product 2", 20) as Product;

const MockRepository = () => ({
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
});

describe("List products use case unit test", () => {
    it("should list products", async () => {
        const productRepository = MockRepository();
        const listProductsSpy = jest
            .spyOn(productRepository, 'findAll')
            .mockReturnValue(Promise.resolve([product1, product2]));
        
        const usecase = new ListProductsUseCase(productRepository);

        const output: OutputListProductsDto = await usecase.execute();

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toStrictEqual(product1.id);
        expect(output.products[0].name).toStrictEqual(product1.name);
        expect(output.products[0].price).toStrictEqual(product1.price);
        expect(output.products[1].id).toStrictEqual(product2.id);
        expect(output.products[1].name).toStrictEqual(product2.name);
        expect(output.products[1].price).toStrictEqual(product2.price);
        expect(listProductsSpy).toHaveBeenCalled();
    });
});