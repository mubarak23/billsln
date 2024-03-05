
import axios, { AxiosResponse } from "axios"
import { IInvoiceData } from "../interfaces/IInvoiceData"
import { IInvoiceResponseData } from "../interfaces/IInvoiceResponseData"
import * as Utils from "../utils/core"
import { ServerError } from "../utils/error-response-types"

const ALBY_TOKEN = process.env.ALBY_TOKEN || ""
const ALBY_URL  = process.env.ALBY_UR || ""

export const createInvoice = async (invoicePayload: IInvoiceData, transactionId: string): Promise<IInvoiceResponseData> => {

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

    return responseData

  } catch(e) {
    const errorMessage = Utils.handleAxiosRequestError(e)
    console.log(`e handleAxiosRequestError message: `, errorMessage)
    console.log(`e message: `, e.message)
    console.log(e.stack)

    throw new ServerError('An error occurred with our payment provider. Please try again at a later time.')
  }

}

