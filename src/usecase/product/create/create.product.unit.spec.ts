import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

let input: InputCreateProductDto;

const MockRepository = () => ({
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
});

beforeEach(() => {
    input =  {
        type: "a",
        name: "Product 1",
        price: 10.0,
    }
})

describe("Create product use case unit test", () => {
    it("should create a product",async () => {
       const productRepository = MockRepository();
       const createProductSpy = jest.spyOn(productRepository, 'create');

       const usecase = new CreateProductUseCase(productRepository);

       const output = await usecase.execute(input);
       expect(output).toStrictEqual({
           id: expect.any(String),
           name: input.name,
           price: input.price,
       });
       expect(createProductSpy).toHaveBeenCalled();
    });
    it("should throw error when product type is invalid", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository); 

        input.type = "c";

        expect(() => usecase.execute(input)).rejects.toThrow("Product type not supported");
    });
    it("should throw error when name is missing", async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository); 

        input.name = "";

        expect(() => usecase.execute(input)).rejects.toThrow("Name is required");
    });
    it("should throw error when price is invalid",async () => {
        const productRepository = MockRepository();
        const usecase = new CreateProductUseCase(productRepository); 

        input.price = -10;

        expect(() => usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
    })
});