

import { getFreshConnection } from "../db";
import { NewServiceDto } from "../dto/NewServiceDto";
import { Services } from "../entity/Service";
import { ServiceResponseData } from "../interfaces/ServiceResponseData";
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

