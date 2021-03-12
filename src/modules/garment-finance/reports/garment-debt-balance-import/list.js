import { inject } from "aurelia-framework";
import moment from "moment";
import numeral from "numeral";
import XLSX from "xlsx";
import { Service } from "./service";
const SupplierLoader = require("../../../../loader/garment-supplier-loader");

@inject(Service)
export class List {
  columns = [
    [
      {
        field: "SupplierName", title: "Supplier", rowspan: 2, formatter: function (value, data, index) {
          return data.SupplierCode ? `${data.SupplierCode} - ${value}` : value;
        }
      },
      { field: "CurrencyCode", title: "Mata Uang", rowspan: 2 },
      {
        field: "CurrencyInitialBalance", title: "Saldo Awal", rowspan: 2, align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "CurrencyPurchaseAmount", title: "Pembelian", rowspan: 2, align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "CurrencyPaymentAmount", title: "Pembayaran", rowspan: 2, align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "CurrencyCurrentBalance", title: "Saldo Akhir", rowspan: 2, align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      { title: "Dalam Rupiah", colspan: 4 }
    ],
    [
      {
        field: "InitialBalance", title: "Saldo Awal", align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "PurchaseAmount", title: "Pembelian", align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "PaymentAmount", title: "Pembayaran", align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      },
      {
        field: "CurrentBalance", title: "Saldo Akhir", align: "right", formatter: function (value, data, index) {
          return numeral(value).format("0,000.00");
        }
      }
    ]
  ];

  itemYears = [];
  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 4,
    },
  };

  tableOptions = {
    showColumns: false,
    search: false,
    showToggle: false,
    sortable: false,
  };

  constructor(service) {
    this.service = service;
    this.info = {};
    this.error = {};
    this.data = [];
    this.isEmpty = true;
    this.currency = "";
    this.purchase = 0;
    this.payment = 0;
    this.closingBalance = 0;
    this.itemMonths = [
      { text: "January", value: 1 },
      { text: "February", value: 2 },
      { text: "March", value: 3 },
      { text: "April", value: 4 },
      { text: "May", value: 5 },
      { text: "June", value: 6 },
      { text: "July", value: 7 },
      { text: "August", value: 8 },
      { text: "September", value: 9 },
      { text: "October", value: 10 },
      { text: "November", value: 11 },
      { text: "Desember", value: 12 },
    ];
    this.currentYear = moment().format("YYYY");

    this.info.month = { text: "January", value: 1 };
    this.info.year = this.currentYear;

    for (var i = parseInt(this.currentYear); i >= 2018; i--) {
      this.itemYears.push(i.toString());
    }
  }

  get supplierLoader() {
    return SupplierLoader;
  }

  supplierView = (supplier) => {
    return supplier.code + " - " + supplier.name;
  };

  loader = (info) => {

    let supplierId = this.info && this.info.supplier ? this.info.supplier.Id : 0;

    let params = {
      supplierId: supplierId,
      month: this.info.month.value,
      year: this.info.year,
      isForeignCurrency: false,
      supplierIsImport: true
    };


    return this.flag
      ? this.service.search(params).then((result) => {

        return {
          total: 0,
          data: result.data
        };
      })
      : { total: 0, data: [] };
  };

  search() {
    this.error = {};
    this.flag = true;
    this.tableList.refresh();
  }

  excel() {
    let supplierId = this.info && this.info.supplier ? this.info.supplier.Id : 0;

    let params = {
      supplierId: supplierId,
      month: this.info.month.value,
      year: this.info.year,
      isForeignCurrency: false,
      supplierIsImport: true
    };

    this.service.getXls(params);

    // this.getExcelData();
  }

  pdf() {
    let supplierId = this.info && this.info.supplier ? this.info.supplier.Id : 0;

    let params = {
      supplierId: supplierId,
      month: this.info.month.value,
      year: this.info.year,
      isForeignCurrency: false,
      supplierIsImport: true
    };

    this.service.getPdf(params);

    // this.getExcelData();
  }

  reset() {
    this.flag = false;
    this.info.supplier = undefined;
    this.data = [];
    this.tableList.refresh();
    this.info.year = moment().format("YYYY");
    this.info.month = { text: "January", value: 1 };
  }
}
