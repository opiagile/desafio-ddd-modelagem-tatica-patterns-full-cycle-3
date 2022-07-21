import express, { Request, Response } from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import FindCustomerUseCase from "../../../usecase/customer/find/find.customer.usecase";
import ListCustomersUseCase from "../../../usecase/customer/list/list.customer.usecase";
import { InputUpdateCustomerDto } from "../../../usecase/customer/update/update.customer.dto";
import UpdateCustomerUseCase from "../../../usecase/customer/update/update.customer.usecase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";

export const customerRoute = express.Router();

customerRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateCustomerUseCase(new CustomerRepository());
    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        };

        const output = await usecase.execute(customerDto);
        res.status(201).send(output);
    } catch (error) {
        res.status(500).send(error);
    }
});

customerRoute.get("/", async (req:Request, res: Response) => {
    const usecase = new ListCustomersUseCase(new CustomerRepository());
    try {
        const output = await usecase.execute();
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send();
    }
})

customerRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new FindCustomerUseCase(new CustomerRepository());
    try {
        const id = req.params.id;
        const output = await usecase.execute({ id });
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send();
    }
});

customerRoute.put("/:id", async (req: Request, res: Response) => {
    const usecase = new UpdateCustomerUseCase(new CustomerRepository());
    try {
        const updateCustomerDto: InputUpdateCustomerDto = {
            id: req.body.id,
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip
            }
        };
        const output = await usecase.execute(updateCustomerDto);
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send();
    }
});