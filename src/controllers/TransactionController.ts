
import { Body, Get, Post, Request, Route, Tags } from "tsoa";
import { NewServiceDto } from "../dto/NewServiceDto";
import { NewTransactionDto } from "../dto/NewTransactionDto";
import { IInvoiceResponseData } from "../interfaces/IInvoiceResponseData";
import { IServerResponse } from "../interfaces/IServerResponse";
import { ServiceResponseData } from "../interfaces/ServiceResponseData";
import * as TransactionService from "../services/transactionService";
import { UnprocessableEntityError } from "../utils/error-response-types";

@Route("/api/transaction")
@Tags("Transaction Service")

export class TransactionController {


  @Post('/new-service')
  public async handleNewTicket(@Body() reqBody: NewServiceDto): Promise<IServerResponse<void>>{
    const { name } = reqBody
   
    if(!name){
      throw new UnprocessableEntityError("A Valid Name was not Provided")
    }
    
    await TransactionService.createNewService(reqBody);
    const resData :  IServerResponse<void>  ={
        status: true
    }
    return resData
}

@Get('/service')
public async handleFetchService(@Request() req: any,
): Promise<IServerResponse<ServiceResponseData[]>> {

  const AvailableserviceList = await TransactionService.fetchTransfromService()

  const resData :  IServerResponse<ServiceResponseData[]>  ={
    status: true,
    data: AvailableserviceList
}
return resData

}

@Post('/new-service-transaction')
public async handleNewTransaction(@Body() reqBody: NewTransactionDto): Promise<IServerResponse<IInvoiceResponseData>>{
  // check that subscription exist
  // phoone number create 
  
  const serviceExist = await TransactionService.singleTransfromService(reqBody.serviceUuid)

  const processTransaction = await TransactionService.processNewTrasnactionService(reqBody, serviceExist.name, serviceExist.serviceId) 
  const resData :  IServerResponse<IInvoiceResponseData>  ={
      status: true,
      data: processTransaction
  }
  return resData
}



}