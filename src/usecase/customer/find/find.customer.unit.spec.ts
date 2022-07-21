import Customer from "../../../domain/customer/entity/customer";
import CustomerRepository from "../../../domain/customer/repository/customer.repository";
import Address from "../../../domain/customer/value-objects/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "zip", "City");
customer.changeAddress(address);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe('Unit test find customer use case', () => {

    it("should find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockResolvedValue(customer);

        const usecase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: "123",
        }

        const output = {
            id: "123",
            name: "John",
            address: {
                street: "Street",
                city: "City",
                zip: "zip",
                number: 123
            }
        }

        const result = await usecase.execute(input);

        expect(result).toStrictEqual(output);
    });

    it("should not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        });

        const usecase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: "123",
        }

        expect(() => {
            return usecase.execute(input)
        }).rejects.toThrow("Customer not found");
    });
});