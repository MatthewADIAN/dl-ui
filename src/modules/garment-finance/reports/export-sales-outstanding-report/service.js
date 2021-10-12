import { inject, Lazy } from "aurelia-framework";
import { RestService } from "../../../../utils/rest-service";

const serviceUri = "export-outstanding-sales-report";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "finance");
  }

  search(info) {
    let endpoint = `${serviceUri}/monitoring`;
    console.log(info);
    return super.list(endpoint, info);
  }

  getXls(info) {
    let endpoint = `${serviceUri}/download?month=${info.month}&year=${info.year}&buyer=${info.buyer}`;
    return super.getXls(endpoint);
  }

  
}
