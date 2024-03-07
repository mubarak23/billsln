import { Column, Entity } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { TransactionStatuses } from "../enums/Statuses";
import { ServiceTransactionColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";


@Entity({ name: Tables.ServiceTransactions })
export class ServiceTransactions extends DefualtEntity {
  @Column({ name: ServiceTransactionColumns.UUID, unique: true })
  uuid: string;

  @Column({ name: ServiceTransactionColumns.AMOUNT, nullable: false })
  amount: number;

  @Column({ name: ServiceTransactionColumns.SATS_AMOUNT, nullable: false})
  satsAmount: number;

  @Column({ name: ServiceTransactionColumns.SERVICE_ID, nullable: false })
  serviceId: number;

  @Column({ name: ServiceTransactionColumns.SERVICE_NAME, nullable: false })
  serviceName: string;

  @Column({ name: ServiceTransactionColumns.PROVIDER, nullable: false })
  provider: string;

  @Column({ name: ServiceTransactionColumns.REFERENCE, nullable: false})
  reference: string;

  @Column({ name: ServiceTransactionColumns.DESCRIPTION, nullable: true})
  description: string;

  @Column({ name: ServiceTransactionColumns.PAYER_NAME, nullable: true})
  payerName: string;

  @Column({ name: ServiceTransactionColumns.PAYER_EMAIL, nullable: true})
  payerEmail: string;

  @Column({ name: ServiceTransactionColumns.PHONE_NUMBER, nullable: true})
  phoneNumber: string;

  @Column({ name: ServiceTransactionColumns.METER_NUMBER, nullable: true})
  meterNumber: string;

  @Column({ name: ServiceTransactionColumns.PAYMENT_HASH, nullable: true})
  paymentHash: string;

  @Column({type: 'json', name: ServiceTransactionColumns.INVOICE_REQUEST, nullable: true })
  invoiceRequest: object

  @Column({type: 'json', name: ServiceTransactionColumns.INVOICE_RESPONSE, nullable: true })
  invoiceResponse: object

  @Column({ name: ServiceTransactionColumns.STATUS, nullable: true, default: TransactionStatuses.CREATED})
  status: TransactionStatuses;

  @Column({
    type: "boolean",
    name: ServiceTransactionColumns.IS_SOFT_DELETED,
    nullable: false,
    default: false,
  })
  isSoftDeleted: boolean;

  initializeNewServiceTransaction(amount: number, satsAmount: number, serviceId: number, 
    provider: string, description: string, payerName: string, payerEmail: string,
    reference: string, serviceName: string){
    const now = utcNow();
    this.uuid = uuidv4();
    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.amount = amount;
    this.satsAmount = satsAmount;
    this.description = description;
    this.reference = reference;
    this.provider = provider;
    this.payerName = payerName;
    this.payerEmail = payerEmail;
    this.createdAt = now;
    return this
  }
}