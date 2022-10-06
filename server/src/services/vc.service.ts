import IVerifiableCredential from '../models/IVerifiableCredentials';
import { DBService, SchemaType } from './db.service';
import { hypersignSDK, logger } from '../config';

export class VerifiableCredentials implements IVerifiableCredential {
  id: string;
  subject: string; // did
  issuer: string; // did
  schemaId: string; //
  dataHash: string; // sha3
  dbSerice: DBService;
  prefix: string;
  appId: string;
  constructor({ subject = '', id = '', issuer = '', schemaId = '', dataHash = '', appId = '' }) {
    this.id = id;
    this.subject = subject;
    this.issuer = issuer;
    this.schemaId = schemaId;
    this.dataHash = dataHash;
    this.appId = appId;
    this.dbSerice = new DBService();
    this.prefix = 'vc_';
  }

  // toString(user: IVerifiableCredential){
  //     return JSON.stringify(user);
  // }

  private getId() {
    const uuid = this.prefix + hypersignSDK.did.getChallange();
    return uuid.substring(0, 20);
  }

  async create() {
    this.id = this.getId();
    const newUser: IVerifiableCredential = await this.dbSerice.add(SchemaType.VerifiableCredential, this);
    return JSON.stringify(newUser);
  }

  async fetch() {
    // delete this['dbSerice']
    const props = Object.getOwnPropertyNames(this);
    const queryParams = {};
    props.forEach((e) => {
      if (e == 'dbSerice') return;
      if (e == 'prefix') return;
      logger.info(this[e]);
      if (this[e] != '' && this[e]) queryParams[e] = this[e];
    });
    const users = await this.dbSerice.getAll(SchemaType.VerifiableCredential, queryParams);
    return users;
  }
}
