// Objeto de valor

import NotificationError from "../../@shared/notification/notification.error";
import ValueObject from "../../@shared/value-objects/value-object.abstract";
import AddressValidatorFactory from "./factory/address.validator.factory";

// Objetos de valor não possuem id e são imutáveis
export default class Address extends ValueObject {
    private _street: string = "";
    private _number: number = 0;
    private _zip: string = "";
    private _city: string = "";

    constructor(street: string, number: number, zip: string, city: string) {
        super();
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;
        
        this.validate();
        this.notifyIfHasErrors();
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zipCode(): string {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    validate() {
        const validator = AddressValidatorFactory.create();
        validator.validate(this);
    }

    toString() {
        return `${this._street}, ${this._number}, ${this._zip}, ${this._city}`
    }

    toJson() {
        return {
            street: this._street,
            number: this._number,
            zip: this._zip,
            city: this._city,
        }
    }
}
