
import axios, { AxiosResponse } from "axios"
import { getFreshConnection } from "../db"
import { ServiceTransactions } from "../entity/ServiceTransaction"
import { IInvoiceData } from "../interfaces/IInvoiceData"
import { IInvoiceResponseData } from "../interfaces/IInvoiceResponseData"
import { InvoiceData } from "../interfaces/InvoiceData"
import * as Utils from "../utils/core"
import { ServerError, UnprocessableEntityError } from "../utils/error-response-types"

const ALBY_TOKEN = process.env.ALBY_TOKEN || ""
const ALBY_URL  = process.env.ALBY_UR || ""

export const createInvoice = async (invoicePayload: IInvoiceData, transactionId: number): Promise<IInvoiceResponseData> => {
  const connection = await getFreshConnection();
  const ServicesTransactionRepo = connection.getRepository(ServiceTransactions);
  const baseURL = `${ALBY_URL}/invoices`

  const headers = {
    'Authorization': `Bearer ${ALBY_TOKEN}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }

  const payload = {
    amount: invoicePayload.amount,
    description: invoicePayload.description,
    memo: invoicePayload.memo,
    currency: invoicePayload.currency,
    payer_name: invoicePayload.payerName,
    payer_email: invoicePayload.payerEmail
  }

  try {
   
    const response: AxiosResponse<any> = await axios.post(baseURL, payload, {
      headers
    })

   
    const responseData: IInvoiceResponseData =  {
      paymentHash: response.data.payment_hash,
      paymentRequest: response.data.payment_request,
      expiresAt: response.data.expires_at
    }
    // update the transaction with invoice payment hash 

    await ServicesTransactionRepo
    .createQueryBuilder()
    .update(ServiceTransactions)
    .set({
      invoiceRequest: payload,
      invoiceResponse: responseData,
      paymentHash: responseData.paymentHash
    })
    .where({ id: transactionId })
    .execute();

    return responseData

  } catch(e) {
    const errorMessage = Utils.handleAxiosRequestError(e)
    console.log(`e handleAxiosRequestError message: `, errorMessage)
    console.log(`e message: `, e.message)
    console.log(e.stack)

    throw new ServerError('An error occurred with our payment provider. Please try again at a later time.')
  }

}


export const IncomingInvoices = async (page: number, items: number): Promise<any> => {

  const baseURL = `${ALBY_URL}/invoices/coming`

  const headers = {
    'Authorization': `Bearer ${ALBY_TOKEN}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }

  
  try {
   
    const response: AxiosResponse<any> = await axios.get(baseURL, {
      headers,
      params: {
        page,
        items
      }
    })


    return response.data;

  } catch(e) {
    const errorMessage = Utils.handleAxiosRequestError(e)
    console.log(`e handleAxiosRequestError message: `, errorMessage)
    console.log(`e message: `, e.message)
    console.log(e.stack)

    throw new ServerError('An error occurred with our payment provider. Please try again at a later time.')
  }

}


export const transformIncomingInvoice = async (page: number, items: number): Promise <InvoiceData[]> => {

  const fetchIncomingInvoices = await IncomingInvoices(page, items)

  if(fetchIncomingInvoices.length === 0){
    throw new UnprocessableEntityError("No Incooming Invoice at the moment")
  }

  const transformInvoiceData: InvoiceData[] = []

  for(const invoice of fetchIncomingInvoices){

    const transformInvoice : InvoiceData = {
      amount: invoice.amount,
      comment: invoice.comment,
      currency: invoice.currency,
      memo: invoice.memo,
      description: invoice.description,
      descriptionHash: invoice.descriptionHash,
      identifier: invoice.identifier,
      expiry: invoice.expiry,
      keySendMessage: invoice.keysend_message,
      createdAt: invoice.created_at,
      creationDate: invoice.creation_date,
      payerName: invoice.payer_name,
      preImage: invoice.preimage,
      paymentHash: invoice.payment_hash,
      paymentRequest: invoice.payment_request,
      payerPubkey: invoice.payer_pubkey,
      rHashStr: invoice.r_hash_str,
      settled: invoice.settled,
      state: invoice.state,
      settledAt: invoice.settled_at,
      type: invoice.type,
      value: invoice.value
        }
        transformInvoiceData.push(transformInvoice)    
  }

  return transformInvoiceData

}

export const fetchInvoiceDetails = async (paymentHash: string): Promise<InvoiceData> => {

  const baseURL = `${ALBY_URL}/invoices/${paymentHash}`

  const headers = {
    'Authorization': `Bearer ${ALBY_TOKEN}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }

  try {
   
    const response: AxiosResponse<any> = await axios.get(baseURL, {
      headers
    })

    const invoice = response.data
    const transformInvoice : InvoiceData = {
      amount: invoice.amount,
      comment: invoice.comment,
      currency: invoice.currency,
      memo: invoice.memo,
      description: invoice.description,
      descriptionHash: invoice.descriptionHash,
      identifier: invoice.identifier,
      expiry: invoice.expiry,
      keySendMessage: invoice.keysend_message,
      createdAt: invoice.created_at,
      creationDate: invoice.creation_date,
      payerName: invoice.payer_name,
      preImage: invoice.preimage,
      paymentHash: invoice.payment_hash,
      paymentRequest: invoice.payment_request,
      payerPubkey: invoice.payer_pubkey,
      rHashStr: invoice.r_hash_str,
      settled: invoice.settled,
      state: invoice.state,
      settledAt: invoice.settled_at,
      type: invoice.type,
      value: invoice.value
        }

    return transformInvoice

  } catch(e) {
    const errorMessage = Utils.handleAxiosRequestError(e)
    console.log(`e handleAxiosRequestError message: `, errorMessage)
    console.log(`e message: `, e.message)
    console.log(e.stack)

    throw new ServerError('An error occurred with our payment provider. Please try again at a later time.')
  }

}


