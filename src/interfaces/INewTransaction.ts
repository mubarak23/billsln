export interface INewTransaction {
  serviceId: number,
  proovider: string,
  amount: number,
  payerName: string,
  payerEmail: string,
  description: string,
  phoneNumber?: string | null,
  meterNumber?: string | null,
}