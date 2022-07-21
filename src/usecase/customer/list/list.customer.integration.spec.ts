import { Sequelize } from "sequelize-typescript";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import CustomerRepository from "../../../domain/customer/repository/customer.repository";
import Address from "../../../domain/customer/value-objects/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import ListCustomersUseCase from "./list.customer.usecase";

const address1 = new Address("Street 1", 123, "Zip 1", "City 1");
const customer1 = CustomerFactory.createWithAddress("Customer 1", address1);

const address2 = new Address("Street 2", 223, "Zip 2", "City 2");
const customer2 = CustomerFactory.createWithAddress("Customer 2", address2);

describe("Integration test list customer use case", () => {

    let customerRepository: CustomerRepository;

    let sequelize: Sequelize;
    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();

        customerRepository = new CustomerRepository();
        customerRepository.create(customer1);
        customerRepository.create(customer2);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    
    it("should list customers", async () => {        
        const listCustomersUseCase = new ListCustomersUseCase(customerRepository);
        const output = await listCustomersUseCase.execute();

        expect(output.customers.length).toBe(2);
        expect(output.customers[0].id).toStrictEqual(customer1.id);
        expect(output.customers[0].name).toStrictEqual(customer1.name);
        expect(output.customers[0].address.street).toStrictEqual(customer1.address.street);
        expect(output.customers[0].address.number).toStrictEqual(customer1.address.number);
        expect(output.customers[0].address.zip).toStrictEqual(customer1.address.zipCode);
        expect(output.customers[0].address.city).toStrictEqual(customer1.address.city);
        expect(output.customers[1].id).toStrictEqual(customer2.id);
        expect(output.customers[1].name).toStrictEqual(customer2.name);
        expect(output.customers[1].address.street).toStrictEqual(customer2.address.street);
        expect(output.customers[1].address.number).toStrictEqual(customer2.address.number);
        expect(output.customers[1].address.zip).toStrictEqual(customer2.address.zipCode);
        expect(output.customers[1].address.city).toStrictEqual(customer2.address.city);
    });
})