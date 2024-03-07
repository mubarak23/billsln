export interface INewTransaction {
  serviceId: number,
  provider: string,
  amount: number,
  payerName: string,
  payerEmail: string,
  description?: string | null,
  phoneNumber?: string | null,
  meterNumber?: string | null,
}