import Order from "./domain/checkout/entity/order";
import OrderItem from "./domain/checkout/entity/order_item";
import Address from "./domain/customer/value-objects/address";
import Customer from "./domain/customer/entity/customer";

// Customer Aggregate
const customer = new Customer("123", "Luis Daniel Assulfi");
const address = new Address("Rua dois", 2, "12345-678", "São Paulo");
customer.changeAddress(address);
customer.activate();

// Order Aggregate
const item1 = new OrderItem("1", "Item 1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item 2", 15, "p2", 2);
const order = new Order("1", "123", [item1, item2]);
