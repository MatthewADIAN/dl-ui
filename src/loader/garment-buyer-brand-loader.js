import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'master/garment-buyer-brands/byName';

module.exports = function (keyword, filter) {

    var config = Container.instance.get(Config);
    var endpoint = config.getEndpoint("core");
    return endpoint.find(resource, { keyword: keyword, filter: filter})
        .then(results => {
            return results.data
        });
}