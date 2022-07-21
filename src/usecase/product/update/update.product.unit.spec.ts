import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
import { InputUpdateProductDto } from './update.product.dto';

let product: Product;
let input: InputUpdateProductDto;

const MockRepository = () => ({
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
});

beforeEach(() => {
    product = ProductFactory.create("a", "product 1", 10.0) as Product;

    input = {
        id: product.id,
        name: "Product 1 updated",
        price: 20,
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Update product use case unit test", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const findProductSpy = jest
            .spyOn(productRepository, 'find')
            .mockReturnValue(Promise.resolve(product));
        const updateProductSpy = jest.spyOn(productRepository, 'update')

        const usecase = new UpdateProductUseCase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
        expect(findProductSpy).toHaveBeenCalledWith(input.id);
        expect(updateProductSpy).toHaveBeenCalled();
    });

    it("should throw an error when name is missing", async () => {
        const productRepository = MockRepository();
        const findProductSpy = jest
            .spyOn(productRepository, 'find')
            .mockReturnValue(Promise.resolve(product));
        const updateProductSpy = jest.spyOn(productRepository, 'update')

        const usecase = new UpdateProductUseCase(productRepository);

        input.name = "";

        await expect(() => usecase.execute(input)).rejects.toThrow("Name is required");
        expect(findProductSpy).toHaveBeenCalledWith(input.id);
        expect(updateProductSpy).toHaveBeenCalledTimes(0);
    });

    it("should throw an error when price is invalid", async () => {
        const productRepository = MockRepository();
        const findProductSpy = jest
            .spyOn(productRepository, 'find')
            .mockReturnValue(Promise.resolve(product));
        const updateProductSpy = jest.spyOn(productRepository, 'update')

        const usecase = new UpdateProductUseCase(productRepository);

        input.price = -10.0;

        await expect(() => usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
        expect(findProductSpy).toHaveBeenCalledWith(input.id);
        expect(updateProductSpy).toHaveBeenCalledTimes(0);
    });
});