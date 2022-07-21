import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
import { InputUpdateProductDto } from './update.product.dto';
import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Update product use case integration test", () => {
    let sequelize: Sequelize;
    let product: Product;
    let input: InputUpdateProductDto;
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

        product = ProductFactory.create("a", "product 1", 10.0) as Product;

        input = {
            id: product.id,
            name: "Product 1 updated",
            price: 20,
        };

        productRepository = new ProductRepository();
        productRepository.create(product);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const usecase = new UpdateProductUseCase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });

    it("should throw an error when name is missing", async () => {
        const usecase = new UpdateProductUseCase(productRepository);

        input.name = "";

        await expect(() => usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should throw an error when price is invalid", async () => {
        const usecase = new UpdateProductUseCase(productRepository);

        input.price = -10.0;

        await expect(() => usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
    });
});