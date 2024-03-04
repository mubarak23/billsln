import { Column, Entity } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { ServiceColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";


@Entity({ name: Tables.Services })
export class Services extends DefualtEntity {
  @Column({ name: ServiceColumns.UUID, unique: true })
  uuid: string;

  @Column({ name: ServiceColumns.NAME, nullable: false })
  name: string;


  @Column({
    type: "boolean",
    name: ServiceColumns.IS_SOFT_DELETED,
    nullable: false,
    default: false,
  })
  isSoftDeleted: boolean;

  initialize(name: string){
    const now = utcNow();
    this.uuid = uuidv4();
    this.name = name; 
    this.createdAt = now;
    return this
  }
}