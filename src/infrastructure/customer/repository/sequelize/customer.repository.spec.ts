import { Sequelize } from "sequelize-typescript";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-objects/address";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {
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
    });

    afterEach(async () => {
        await sequelize.close();
    });
    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "123456", "City 1");
        customer.changeAddress(address);
        customer.addRewardPoints(20);

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "c1" } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zipCode,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });
    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "123456", "City 1");
        customer.changeAddress(address);
        customer.addRewardPoints(20);

        await customerRepository.create(customer);

        const createdCustomerModel = await CustomerModel.findOne({ where: { id: "c1" } });
        expect(createdCustomerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zipCode,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });

        customer.changeName("Updated Customer");
        const newAddress = new Address("New Street", 2, "654321", "New City");
        customer.changeAddress(newAddress);
        customer.deactivate();
        customer.addRewardPoints(20);

        await customerRepository.update(customer);

        const updatedCustomerModel = await CustomerModel.findOne({ where: { id: "c1" } });
        expect(updatedCustomerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipCode: customer.address.zipCode,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        });
    });
    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Customer 1");
        const address = new Address("Street 1", 1, "123456", "City 1");
        customer.changeAddress(address);
        customer.addRewardPoints(20);

        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find("c1");

        expect(customer).toEqual(foundCustomer);
    });
    it("should throw an error when customer is not found", () => {
        const customerRepository = new CustomerRepository();
        expect(async () => {
            await customerRepository.find("abc123");
        }).rejects.toThrow("Customer not found");
    });
    it ("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("c1", "Customer 1");
        const address1 = new Address("Street 1", 1, "123456", "City 1");
        customer1.changeAddress(address1);
        customer1.addRewardPoints(20);

        await customerRepository.create(customer1);

        const customer2 = new Customer("c2", "Customer 2");
        const address2 = new Address("Street 2", 2, "123456", "City 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoints(40);

        await customerRepository.create(customer2);

        const foundCostumers = await customerRepository.findAll();

        const customers = [customer1, customer2];

        expect(customers).toHaveLength(2);
        expect(customers).toEqual(foundCostumers);
    })
});