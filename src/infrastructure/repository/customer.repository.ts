import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zipCode,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address.street,
                number: entity.address.number,
                zipCode: entity.address.zipCode,
                city: entity.address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: {
                    id: entity.id
                }
            });
    }

    async find(id: string): Promise<Customer> {
        try {
            const customerModel = await CustomerModel.findOne(
                { where: {
                    id
                },
                rejectOnEmpty: true,
            });
            return this.createCustomerEntityFrom(customerModel);
        } catch (error) {
            throw new Error("Customer not found");
        }
    }
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        return customerModels.map(model => this.createCustomerEntityFrom(model));
    }

    private createCustomerEntityFrom(model: CustomerModel): Customer {
        const customer = new Customer(model.id, model.name);
        const address = new Address(
            model.street, 
            model.number, 
            model.zipCode, 
            model.city
        );
        customer.changeAddress(address);
        customer.addRewardPoints(model.rewardPoints);

        model.active ? customer.activate() : customer.deactivate();
        
        return customer;
    }
}