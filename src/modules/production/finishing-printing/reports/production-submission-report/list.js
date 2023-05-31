import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';


import moment from 'moment';
var ProductionOrderLoader = require('../../../../../loader/production-order-loader');

@inject(Router, Service)
export class List {

    constructor(router, service) {

        this.service = service;
        this.router = router;
        this.today = new Date();
        this.flag = false;
    }

    tableOptions = {
        search: false,
        showToggle: false,
        showColumns: false,
        pagination: false
    }

    areaOptionsHard = [
        { text: "DIGITAL PRINT", value: 1 },
        { text: "DYEING", value: 2 },
        { text: "FINISHING", value: 3 },
        { text: "PRETREATMENT", value: 4 },
        { text: "PRINTING", value: 5 },
            ];

    columns = [
            { field: "index", title: "No", valign: "top" },
            { field: "date", title: "Tanggal",  valign: "top", 
                    formatter: function (value, data, index) {
                        return moment(value).format("DD MMM YYYY"); 
                    } 
            },
            { field: "bonNo", title: "Nomor Bon", valign: "top" },
            { field: "productionOrderNo", title: "Nomor Order", valign: "top" },
            { field: "orderType", title: "Jenis Order", valign: "top" },
            { field: "buyer", title: "Buyer", valign: "top" },
            { field: "construction", title: "Konstruksi", valign: "top" },
            { field: "motif", title: "Motif", valign: "top" },
            { field: "color", title: "Warna yang Diminta", valign: "top" },
            { field: "cartNo", title: "Kereta", valign: "top" },
            { field: "inputQuantity", title: "Panjang", valign: "top" },
    ];

    bind(context) {
        this.context = context;
        this.data = context.data;
        this.infoAreaHard="";
        this.infoShift="";
    }

    rowFormatter(data, index) {
        return {};
    }

    search() {
        this.error = {};
        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.flag = true;
            this.Table.refresh();
        }
    }

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;
    
      
        var args = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
            bonNo: this.bonNo,
            startdate : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : null,
            finishdate : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : null,
            orderNo:this.productionOrderNo ? this.productionOrderNo.OrderNo : null,
          };
        return this.flag ?
            (
            this.service.search(args)
                .then(result => {
                    var index=0;
                    for(var data of result.data){
                        index++;
                        data.index=index;
                    }
                    return {
                        total: result.total,
                        data: result.data
                    };
                })
            ) : { total: 0, data: [] };
       
      }

    ExportToExcel() {
        var args = {
            bonNo: this.bonNo,
            startdate : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : null,
            finishdate : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : null,
            orderNo:this.productionOrderNo ? this.productionOrderNo.OrderNo : null,
          };
        this.service.generateExcel(args);
    }

    get productionOrderLoader() {
        return ProductionOrderLoader;
    }
}