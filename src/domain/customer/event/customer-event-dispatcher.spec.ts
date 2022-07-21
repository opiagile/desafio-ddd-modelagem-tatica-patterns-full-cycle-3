import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-objects/address";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerChangedAddressHandler from "./handlers/customer-changed-address-handler";
import CustomerCreatedFirstHandler from "./handlers/customer-created-first-handler";
import CustomerCreatedSecondHandler from "./handlers/customer-created-second-handler";

describe("Customer event dispatcher tests", () => {
    describe("Customer Created Events", () => {
        it("should register customer created events", () => {
            const eventDispatcher = new EventDispatcher();
            const firstEventHandler = new CustomerCreatedFirstHandler();
            const secondEventHandler = new CustomerCreatedSecondHandler();
    
            eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
            eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toHaveLength(2);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
        });
        it("should unregister an event handler", () => {
            const eventDispatcher = new EventDispatcher();
            const firstEventHandler = new CustomerCreatedFirstHandler();
            const secondEventHandler = new CustomerCreatedSecondHandler();
    
            eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
            eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toHaveLength(2);
    
            eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toHaveLength(1);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(secondEventHandler);
        });
        it("should unregister all events", () => {
            const eventDispatcher = new EventDispatcher();
            const firstEventHandler = new CustomerCreatedFirstHandler();
            const secondEventHandler = new CustomerCreatedSecondHandler();
    
            eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
            eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toHaveLength(2);
    
            eventDispatcher.unregisterAll();
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
        });
        it("should notify all event handlers", () => {
            const eventDispatcher = new EventDispatcher();
            const firstEventHandler = new CustomerCreatedFirstHandler();
            const secondEventHandler = new CustomerCreatedSecondHandler();
    
            const spyFirstEventHandler = jest.spyOn(firstEventHandler, "handle");
            const spySecondEventHandler = jest.spyOn(secondEventHandler, "handle");
    
            eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
            eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toHaveLength(2);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    
            const customerCreatedEvent = new CustomerCreatedEvent({
                name: "Customer 1"
            });
    
            eventDispatcher.notify(customerCreatedEvent);
    
            expect(spyFirstEventHandler).toHaveBeenCalled();
            expect(spySecondEventHandler).toHaveBeenCalled();
        });
    });
    describe("Customer Changed Address Event", () => {
        it("should notify when customer change address", () => {
            const eventDispatcher = new EventDispatcher();
            const customerChangedAddressHandler = new CustomerChangedAddressHandler();
            const spyCustomerChangedAddressHandler = jest.spyOn(customerChangedAddressHandler, "handle");

            eventDispatcher.register("CustomerChangedAddressEvent", customerChangedAddressHandler);

            expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toHaveLength(1);
            expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(customerChangedAddressHandler);
            
            const customer = new Customer("c1", "Customer 1");
            customer.eventDispatcher = eventDispatcher;
            const address = new Address("Street 1", 1, "123456", "City 1");

            customer.changeAddress(address);

            expect(spyCustomerChangedAddressHandler).toHaveBeenCalled();

        });
    })
});