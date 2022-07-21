import { app, sequelize } from "../express"
import request from "supertest";
import { InputCreateProductDto, OutputCreateProductDto } from "../../../usecase/product/create/create.product.dto";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                type: "a",
                name: "Product 1",
                price: 10.0
            });
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.price).toBe(10.0);
    });
    it("should not create a product",async () => {
        const response = await request(app)
            .post("/products")
            .send({
                type: "a",
                name: "Product 1",
                price: -10.0
            });
        expect(response.status).toBe(500);
    });
    it("should list all products", async () => {
        let responseCreateProduct = await createProduct({
            type: "a",
            name: "Product 1",
            price: 10.0
        });
        expect(responseCreateProduct.status).toBe(201);
        responseCreateProduct = await createProduct({
            type: "a",
            name: "Product 2",
            price: 20.0
        });
        expect(responseCreateProduct.status).toBe(201);

        const findAllResponse = await request(app)
            .get("/products")
            .send();
        expect(findAllResponse.status).toBe(200);
        expect(findAllResponse.body.products.length).toBe(2);

        const product1 = findAllResponse.body.products[0];
        expect(product1.name).toBe("Product 1");
        expect(product1.price).toBe(10);
        const product2 = findAllResponse.body.products[1];
        expect(product2.name).toBe("Product 2");
        expect(product2.price).toBe(20);
    });
    it("should find a product", async () => {
        const createProductResponse = await createProduct({
            type: "a",
            name: "Product 1",
            price: 10.0
        });
        expect(createProductResponse.status).toBe(201);

        const id = createProductResponse.body.id;

        const findProductResponse = await request(app)
            .get(`/products/${id}`)
            .send();
        expect(findProductResponse.status).toBe(200);
        expect(findProductResponse.body.id).toBe(id);
        expect(findProductResponse.body.name).toBe("Product 1");
        expect(findProductResponse.body.price).toBe(10.0);
    });
    it("should not find a product", async () => {
        const id = expect.any(String);

        const findCustomerResponse = await request(app)
            .get(`/products/${id}`)
            .send();
        expect(findCustomerResponse.status).toBe(500);
    });
    it("should update a product", async () => {
        const createProductResponse = await createProduct({
            type: "a",
            name: "Product 1",
            price: 10.0
        });
        expect(createProductResponse.status).toBe(201);

        const id = createProductResponse.body.id;
        const updateProductDto = {
            id, 
            name: "Product 1 updated",
            price: 15.0,
        };

        const updateProductResponse = await request(app)
            .put(`/products/${id}`)
            .send(updateProductDto);
        
        expect(updateProductResponse.status).toBe(200);
        expect(updateProductResponse.body.id).toBe(updateProductDto.id);
        expect(updateProductResponse.body.name).toBe(updateProductDto.name);
        expect(updateProductResponse.body.price).toBe(updateProductDto.price);
    });
    it("should not update a product", async () => {
        const id = expect.any(String);
        const updateProductDto = {
            id, 
            name: "Product 1 Updated",
            price: -15.0
        };

        const updateProductResponse = await request(app)
            .put(`/products/${id}`)
            .send(updateProductDto);
        
        expect(updateProductResponse.status).toBe(500);
    });
});

async function createProduct(productDto: InputCreateProductDto) {
    const output = await request(app)
        .post("/products")
        .send(productDto);

    return output;
}