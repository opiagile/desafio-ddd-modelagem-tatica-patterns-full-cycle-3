import { Sequelize } from "sequelize-typescript";
import NotificationError from "../../../domain/@shared/notification/notification.error";
import Customer from "../../../domain/customer/entity/customer";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import CustomerRepository from "../../../domain/customer/repository/customer.repository";
import Address from "../../../domain/customer/value-objects/address";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import { InputUpdateCustomerDto } from "./update.customer.dto";
import UpdateCustomerUseCase from "./update.customer.usecase";

describe("Integration test update customer use case", () => {
  let address: Address;
  let customer: Customer;
  let input: InputUpdateCustomerDto;
  let customerRepository: CustomerRepository;

  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();

    address = new Address("Street", 123, "zip", "city");
    customer = CustomerFactory.createWithAddress("John", address);

    customerRepository = new CustomerRepository();
    customerRepository.create(customer);

    input = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    };
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a customer", async () => {
    const usecase = new UpdateCustomerUseCase(customerRepository);

    const output = await usecase.execute(input);

    expect(output).toStrictEqual(input);
  });

  it("should thrown an error when name is missing", async () => {
    const customerRepository = new CustomerRepository();

    const usecase = new UpdateCustomerUseCase(customerRepository);

    input.name = "";

    await expect(usecase.execute(input)).rejects.toThrow(
      new NotificationError([
        {
          message: "Name is required",
          context: "customer",
        },
      ])
    );
  });

  it("should thrown an error when address is missing", async () => {
    const customerRepository = new CustomerRepository();

    const usecase = new UpdateCustomerUseCase(customerRepository);
    input.address.street = "";

    await expect(usecase.execute(input)).rejects.toThrow("Street is required");
  });
});
