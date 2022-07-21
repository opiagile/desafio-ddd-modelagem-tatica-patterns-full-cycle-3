import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Create product use case integration test", () => {
    let input: InputCreateProductDto;    
    let sequelize: Sequelize;
    let productRepository: ProductRepository;

    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();

        productRepository = new ProductRepository();

        input =  {
            type: "a",
            name: "Product 1",
            price: 10.0,
        }
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product",async () => {
       const usecase = new CreateProductUseCase(productRepository);

       const output = await usecase.execute(input);
       expect(output).toStrictEqual({
           id: expect.any(String),
           name: input.name,
           price: input.price,
       });
    });
    it("should throw error when product type is invalid", async () => {
        const usecase = new CreateProductUseCase(productRepository); 

        input.type = "c";

        expect(() => usecase.execute(input)).rejects.toThrow("Product type not supported");
    });
    it("should throw error when name is missing", async () => {
        const usecase = new CreateProductUseCase(productRepository); 

        input.name = "";

        expect(() => usecase.execute(input)).rejects.toThrow("Name is required");
    });
    it("should throw error when price is invalid",async () => {
        const usecase = new CreateProductUseCase(productRepository); 

        input.price = -10;

        expect(() => usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
    })
});