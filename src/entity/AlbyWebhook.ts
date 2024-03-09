//  @Column({ type: "jsonb", name: BrandColumns.CATEGORIES, nullable: true })
  // categories: { name: string; uuid: string }[];
  import { Column, Entity } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AlbyWebhookColumns } from "../enums/TableColumns";
import Tables from "../enums/Tables";
import { utcNow } from "../utils/core";
import DefualtEntity from "./BaseEntity";
  
  
  @Entity({ name: Tables.AlbyWebhooks })
  export class AlbyWebhooks extends DefualtEntity {
    @Column({ name: AlbyWebhookColumns.UUID, unique: true })
    uuid: string;

    @Column({ name: AlbyWebhookColumns.ALBY_ID, nullable: true })
    albyId: string;
  
    @Column({ name: AlbyWebhookColumns.DESCRIPTION, nullable: false })
    description: string;

    @Column({ name: AlbyWebhookColumns.URL, nullable: false })
    url: string;

    @Column({ type: "jsonb", name: AlbyWebhookColumns.FILTER_TYPE, nullable: true })
    filterTypes: string[];

    @Column({ type: "jsonb", name: AlbyWebhookColumns.WEBHOOK_REQUEST, nullable: true })
    webhookRequest: object;

    @Column({ type: "jsonb", name: AlbyWebhookColumns.WEBHOOK_RESPONSE, nullable: true })
    webhookResponse: object;
  
    @Column({
      type: "boolean",
      name: AlbyWebhookColumns.IS_SOFT_DELETED,
      nullable: false,
      default: false,
    })
    isSoftDeleted: boolean;
  
    initializeNewWebhook(description: string, url: string){
      const now = utcNow();
      this.uuid = uuidv4();
      this.description = description;
      this.url = url, 
      this.createdAt = now;
      return this
    }
  }
