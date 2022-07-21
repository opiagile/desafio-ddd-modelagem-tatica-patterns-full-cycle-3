import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";


describe("Integration test find product use case", () => {
    const product = new Product("123", "product 1", 10.0);
    
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
        productRepository.create(product);
    });

    afterEach(async () => {
        await sequelize.close();
    });

   it("should find a product",async () => {
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
   });
});