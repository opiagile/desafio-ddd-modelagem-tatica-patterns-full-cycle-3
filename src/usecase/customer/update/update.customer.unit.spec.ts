import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-objects/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const address = new Address("Street", 123, "zip", "city");
const customer = CustomerFactory.createWithAddress("John", address);

const getInput = () => ({
  id: customer.id,
  name: "John Updated",
  address: {
    street: "Street Updated",
    number: 1234,
    zip: "Zip Updated",
    city: "City Updated",
  },
});

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test update customer use case", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  it("should update a customer", async () => {
    let input = getInput();
    const customerRepository = MockRepository();
    const findCustomerSpy = jest
      .spyOn(customerRepository, "find")
      .mockReturnValue(Promise.resolve(customer));

    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    const output = await updateCustomerUseCase.execute(input);

    expect(output).toStrictEqual(input);
    expect(findCustomerSpy).toHaveBeenCalledWith(customer.id);
  });

  it("should thrown an error when name is missing", async () => {
    let input = getInput();
    const customerRepository = MockRepository();
    const findCustomerSpy = jest
      .spyOn(customerRepository, "find")
      .mockReturnValue(Promise.resolve(customer));

    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    input.name = "";

    await expect(updateCustomerUseCase.execute(input)).rejects.toThrow(
      "customer: Name is required"
    );
    expect(findCustomerSpy).toHaveBeenCalledWith(customer.id);
  });

  it("should thrown an error when address is missing", async () => {
    let input = getInput();
    const customerRepository = MockRepository();
    const findCustomerSpy = jest
      .spyOn(customerRepository, "find")
      .mockReturnValue(Promise.resolve(customer));

    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

    input.address.street = "";

    await expect(updateCustomerUseCase.execute(input)).rejects.toThrow(
      "Street is required"
    );
    expect(findCustomerSpy).toHaveBeenCalledWith(customer.id);
  });
});
