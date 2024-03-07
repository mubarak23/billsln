import { fiatToSatoshis } from 'bitcoin-conversion';
import { getFreshConnection } from "../db";
import { NewServiceDto } from "../dto/NewServiceDto";
import { NewTransactionDto } from '../dto/NewTransactionDto';
import { Services } from "../entity/Service";
import { ServiceTransactions } from "../entity/ServiceTransaction";
import { ServicesEnum } from "../enums/Statuses";
import { currency } from '../interfaces/ICurrency';
import { IInvoiceData } from '../interfaces/IInvoiceData';
import { IInvoiceResponseData } from '../interfaces/IInvoiceResponseData';
import { INewTransaction } from "../interfaces/INewTransaction";
import { ServiceResponseData } from "../interfaces/ServiceResponseData";
import * as AlbyWalletService from '../services/ablyService';
import * as Utils from '../utils/core';
import { UnprocessableEntityError } from "../utils/error-response-types";

export const createNewService = async (payload: NewServiceDto): Promise<boolean> => {
  const connection = await getFreshConnection();
  const ServicesRepo = connection.getRepository(Services);

  const serviceExist = await ServicesRepo.findOne({
    where: { name: payload.name, isSoftDeleted: false}
  })

  if(serviceExist){
    throw new UnprocessableEntityError("Service already Exist")
  }

  let SaveNewService = new Services().initializeNewService(payload.name);
  
  SaveNewService = await ServicesRepo.save(SaveNewService);
 
  return true
}

export const fetchTransfromService = async (): Promise<ServiceResponseData[]> => {
  const connection = await getFreshConnection();
  const ServicesRepo = connection.getRepository(Services);

  const services = await ServicesRepo.find();

  if(services.length === 0){
    throw new UnprocessableEntityError("No Available Service at the moment")
  }

  let response : ServiceResponseData[] = []

  for (const service of services){
    const transformService: ServiceResponseData = {
      serviceUuid: service.uuid,
      name: service.name
    } 
    response.push(transformService)
  }

  return response;
}



export const singleTransfromService = async (serviceUuid: string): Promise<ServiceResponseData> => {
  const connection = await getFreshConnection();
  const ServicesRepo = connection.getRepository(Services);

  const service = await ServicesRepo.findOne({
    where: { uuid: serviceUuid}
  });

  if(!service){
    throw new UnprocessableEntityError("Specified Service Does Not Exist")
  }

    const transformService: ServiceResponseData = {
      serviceUuid: service.uuid,
      name: service.name,
      serviceId: service.id
    } 

  return transformService;
}


export const processNewTrasnactionService = async (data: NewTransactionDto, service: string, serviceId: number): Promise<IInvoiceResponseData> => {
  
  const satsAmount = await fiatToSatoshis(data.amount, 'NGN');
  const reference = Utils.generateUniqueReference(15);
  const newPayload: INewTransaction = {
    payerName: data.payerName,
    serviceId,
    provider: data.provider,
    amount: data.amount,
    payerEmail: data.payerEmail,
  }
  if(service === ServicesEnum.POWER){
    newPayload.meterNumber = data.meterNumber
    newPayload.description = 'Purchase Power with sats'
    const newService = await processNewPowerTrasnactionService(newPayload, satsAmount, reference)
    return newService
  } 
  if(service === ServicesEnum.AIRTIME){
    newPayload.meterNumber = data.phoneNumber
    newPayload.description = 'Purchase Airtimes with sats'
    const newService = await processNewAirtimeTrasnactionService(newPayload, satsAmount, reference)
    return newService
  } 
  if(service === ServicesEnum.DATA){
    newPayload.meterNumber = data.phoneNumber
    newPayload.description = 'Purchase Data with sats'
    const newService = await processNewDataTrasnactionService(newPayload, satsAmount, reference)
    return newService
  } 
  throw new UnprocessableEntityError('No Service Provider Available')
}

export const processNewDataTrasnactionService = async (data: INewTransaction, satsAmount: number, reference: string): Promise<IInvoiceResponseData> => {
  
  const connection = await getFreshConnection();
  const ServicesTransactionRepo = connection.getRepository(ServiceTransactions);


  let saveNewServiceTransaction = new ServiceTransactions().initializeNewServiceTransaction(data.amount,satsAmount, 
    data.serviceId,data.provider,data.description, data.payerName, data.payerEmail, reference, ServicesEnum.DATA)
  
    saveNewServiceTransaction = await ServicesTransactionRepo.save(saveNewServiceTransaction);

    const invoicePayload: IInvoiceData = {
      payerEmail: saveNewServiceTransaction.payerEmail,
      payerName: saveNewServiceTransaction.payerName,
      amount: satsAmount,
      description: data.description,
      memo: data.description,
      currency: currency.BTC
    }
    // call alby service to create invoice and update transaction
    const newTransactionInvoice: IInvoiceResponseData = await AlbyWalletService.createInvoice(invoicePayload, saveNewServiceTransaction.id)

    return newTransactionInvoice

}


export const processNewAirtimeTrasnactionService = async (data: INewTransaction, satsAmount: number, reference: string): Promise<IInvoiceResponseData> => {
  const connection = await getFreshConnection();
  const ServicesTransactionRepo = connection.getRepository(ServiceTransactions);


  let saveNewServiceTransaction = new ServiceTransactions().initializeNewServiceTransaction(data.amount,satsAmount, 
    data.serviceId,data.provider,data.description, data.payerName, data.payerEmail, reference, ServicesEnum.DATA)
  
    saveNewServiceTransaction = await ServicesTransactionRepo.save(saveNewServiceTransaction);

    const invoicePayload: IInvoiceData = {
      payerEmail: saveNewServiceTransaction.payerEmail,
      payerName: saveNewServiceTransaction.payerName,
      amount: satsAmount,
      description: data.description,
      memo: data.description,
      currency: currency.BTC
    }
    // call alby service to create invoice and update transaction
    const newTransactionInvoice: IInvoiceResponseData = await AlbyWalletService.createInvoice(invoicePayload, saveNewServiceTransaction.id)

    return newTransactionInvoice
}

export const processNewPowerTrasnactionService = async (data: INewTransaction, satsAmount: number, reference: string): Promise<IInvoiceResponseData> => {
  const connection = await getFreshConnection();
  const ServicesTransactionRepo = connection.getRepository(ServiceTransactions);


  let saveNewServiceTransaction = new ServiceTransactions().initializeNewServiceTransaction(data.amount,satsAmount, 
    data.serviceId,data.provider,data.description, data.payerName, data.payerEmail, reference, ServicesEnum.DATA)
  
    saveNewServiceTransaction = await ServicesTransactionRepo.save(saveNewServiceTransaction);

    const invoicePayload: IInvoiceData = {
      payerEmail: saveNewServiceTransaction.payerEmail,
      payerName: saveNewServiceTransaction.payerName,
      amount: satsAmount,
      description: data.description,
      memo: data.description,
      currency: currency.BTC
    }
    // call alby service to create invoice and update transaction
    const newTransactionInvoice: IInvoiceResponseData = await AlbyWalletService.createInvoice(invoicePayload, saveNewServiceTransaction.id)

    return newTransactionInvoice
}

