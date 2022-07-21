import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerChangedAddressEvent from "../event/customer-changed-address.event";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-objects/address";

// Entidade focada em negocio
export default class Customer extends Entity {
  private _name: string;
  private _address!: Address; // opcional
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher: EventDispatcherInterface;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;
    this.validate();

    this.notifyIfHasErrors();
  }

  validate() {
    const validator = CustomerValidatorFactory.create();
    validator.validate(this);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
    this.notifyIfHasErrors();
  }

  changeAddress(address: Address) {
    this._address = address;
    this.notifyCustomerChangedAddress();
  }

  private notifyCustomerChangedAddress() {
    const eventData = {
      id: this._id,
      name: this._name,
      address: this._address.toString(),
    };
    const costumerChangedAddressEvent = new CustomerChangedAddressEvent(
      eventData
    );
    this._eventDispatcher?.notify(costumerChangedAddressEvent);
  }

  get address(): Address {
    return this._address;
  }

  activate() {
    // Regra de negocio: o cliente so pode ser ativado se tiver um
    // endereco para emissao de nota fiscal
    if (!this._address) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  isActive() {
    return this._active;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  set eventDispatcher(dispatcher: EventDispatcherInterface) {
    this._eventDispatcher = dispatcher;
  }

  private notifyIfHasErrors() {
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.errors);
    }
  }
}

// Os dados necessitam estar consistentes
// Pela regra de negocio não existem clientes sem nome
// let customer = new Customer("123");

// Dados consistentes
// devem estar disponiveis em todo o sistema
// let customer = new Customer("123", "Maria de Fatima");

// Uma entidade por padrão deve ser sempre autovalidada
// Se ela não se auto-valida há chance de gerar inconsistência

// Entidade vs ORM
// Esta entidade deste arquivo é focada em negocio.
// O ORM necessita de uma entidade focada em persistencia (model)
// Exemplo de estruturacao de arquivos com separacao
// Domain => complexidade de negocio
// - entity
// -- customer.ts (regra de negocio)
// infrastructure (mundo externo) => complexidade acidental
// - entity (ou model)
// -- customer.ts (getters e setters)
