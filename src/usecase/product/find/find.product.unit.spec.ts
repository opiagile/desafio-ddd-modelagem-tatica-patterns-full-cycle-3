import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "product 1", 10.0);

const MockRepository = () => ({
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
});

describe("Unit test find product use case", () => {
   it("should find a product",async () => {
    const productRepository = MockRepository();
    const findProductSpy = jest
        .spyOn(productRepository, 'find')
        .mockReturnValue(Promise.resolve(product));

    const usecase = new FindProductUseCase(productRepository); 

    const input = {
        id: "123",
    };

    const output = {
        id: product.id,
        name: product.name,
        price: product.price,
    };

    const result = await usecase.execute(input);

    expect(result).toStrictEqual(output);
    expect(findProductSpy).toHaveBeenCalled();
   });
   it("should not find a product", async () => {
        const productRepository = MockRepository();
        const findProductSpy = jest.spyOn(productRepository, 'find').mockImplementation(() => {
            throw new Error("Product not found");
        });

        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: expect.any(Number),
        }

        expect(() => usecase.execute(input)).rejects.toThrow("Product not found");
        expect(findProductSpy).toHaveBeenCalled();
   });
});