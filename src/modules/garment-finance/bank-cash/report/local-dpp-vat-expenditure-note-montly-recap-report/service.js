import { buildQueryString } from 'aurelia-path';
import { RestService } from '../../../../../utils/rest-service';

const serviceUri = "dpp-vat-expenditure-note/local-monthly-recap";

export class Service extends RestService {
  constructor(http, aggregator, config, endpoint) {
    super(http, aggregator, config, "finance");
  }

    search(info) {
        let endpoint = `${serviceUri}/monitoring`;
        return super.list(endpoint, info);
    }

    generateExcel(info) {
        let endpoint = `${serviceUri}/download?${buildQueryString(info)}`;
        return super.getXls(endpoint);
    }

    generateDetailExcel(info) {
        let endpoint = `${serviceUri}/detail/download?${buildQueryString(info)}`;
        return super.getXls(endpoint);
    }

}