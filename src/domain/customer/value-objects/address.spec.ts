import Address from "./address"

describe("Address unit tests", () => {
    it("should throw an error when street is missing", () => {
        expect(() => {
            const address = new Address("", 123, "123456", "City 1")
        }).toThrowError("customer: Street is required");
    });
    it("should throw an error when number is missing", () => {
        expect(() => {
            const address = new Address("", undefined, "123456", "City 1")
        }).toThrowError("customer: Number is required");
    });
    it("should throw an error when zipCode is missing", () => {
        expect(() => {
            const address = new Address("", undefined, "", "City 1")
        }).toThrowError("customer: Zip code is required");
    });
    it("should throw an error when city is missing", () => {
        expect(() => {
            const address = new Address("", undefined, "123456", "")
        }).toThrowError("customer: City is required");
    });
    it("should throw an error when street, number, zip code and city are missing", () => {
        expect(() => {
            const address = new Address("", undefined, "", "")
        }).toThrowError("customer: Street is required, customer: Number is required, customer: Zip code is required, customer: City is required");
    })
});