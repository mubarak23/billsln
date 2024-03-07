// NewTransactionDto

export interface NewTransactionDto {
  serviceUuid: string,
  provider: string,
  amount: number,
  payerName: string,
  payerEmail: string,
  phoneNumber?: string | null,
  meterNumber?: string | null,
}