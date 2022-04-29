import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            const customer = new Customer("", "John");
        }).toThrowError("Id is required");
    });
    it("should throw error when name is empty", () => {
        expect(() => {
            const customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });
    it("should change name", () => {
        const customer = new Customer("123", "John");
        customer.changeName("Doe");
        expect(customer.name).toBe("Doe");
    });
    it("should active customer", () => {
        const customer = new Customer("123", "John");
        const address = new Address("Street 1", 123, "12345-678", "Sao Paulo");
        customer.changeAddress(address);
        customer.activate();
        expect(customer.isActive()).toBeTruthy();
    });
    it("should deactivate customer", () => {
        const customer = new Customer("123", "John");

        customer.deactivate();

        expect(customer.isActive()).toBeFalsy();
    });
    it("should throw error when address is undefined when you active a customer", () => {
        expect(() => {
            const customer = new Customer("123", "John");
            customer.activate()
        }).toThrowError("Address is mandatory to activate a customer");
    });
    it("should add reward points", () => {
        const customer = new Customer("123", "John");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});