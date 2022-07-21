import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputListProductsDto } from "./list.product.dto";
import ListProductsUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product 1", 10) as Product;
const product2 = ProductFactory.create("a", "Product 2", 20) as Product;

describe("List products use case integration test", () => {

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
        productRepository.create(product1);
        productRepository.create(product2);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list products", async () => {        
        const usecase = new ListProductsUseCase(productRepository);

        const output: OutputListProductsDto = await usecase.execute();

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toStrictEqual(product1.id);
        expect(output.products[0].name).toStrictEqual(product1.name);
        expect(output.products[0].price).toStrictEqual(product1.price);
        expect(output.products[1].id).toStrictEqual(product2.id);
        expect(output.products[1].name).toStrictEqual(product2.name);
        expect(output.products[1].price).toStrictEqual(product2.price);
    });
});