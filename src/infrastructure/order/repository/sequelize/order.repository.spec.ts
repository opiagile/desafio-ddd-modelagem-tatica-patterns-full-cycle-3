import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-objects/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "123456", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: orderItem.productId,
        },
      ],
    });
  });
  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "123456", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    await productRepository.create(product1);

    const orderRepository = new OrderRepository();
    const orderItem1 = new OrderItem(
      "i1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "i2",
      product2.name,
      product2.price,
      product2.id,
      5
    );
    order.addItem(orderItem2);

    await orderRepository.update(order);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(updatedOrderModel.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: customer.id,
        total: order.total(),
        items: [
          {
            id: orderItem1.id,
            name: orderItem1.name,
            price: orderItem1.price,
            quantity: orderItem1.quantity,
            order_id: order.id,
            product_id: orderItem1.productId,
          },
          {
            id: orderItem2.id,
            name: orderItem2.name,
            price: orderItem2.price,
            quantity: orderItem2.quantity,
            order_id: order.id,
            product_id: orderItem2.productId,
          },
        ],
      });
  });
  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "123456", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);
    expect(order).toEqual(foundOrder);
  });
  it("should thrown an error if order is not found", async () => {
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("abc123");
    }).rejects.toThrow("Order not found");
  });
  it("should find all customers", async () => {
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

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product2);

    const orderRepository = new OrderRepository();
    const orderItem1 = new OrderItem(
      "i1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order1 = new Order("o1", customer1.id, [orderItem1]);
    await orderRepository.create(order1);

    const orderItem2 = new OrderItem(
      "i2",
      product2.name,
      product2.price,
      product2.id,
      2
    );
    const order2 = new Order("o2", customer2.id, [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    const orders = [order1, order2];

    expect(foundOrders).toHaveLength(2);
    expect(orders).toEqual(foundOrders);
  });
});
