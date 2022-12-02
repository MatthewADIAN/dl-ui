import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service, CoreService } from './service';
import { debug } from 'util';
import numeral from 'numeral';

numeral.defaultFormat("0,000.000000");

const NumberFormat = "0,0.00";

var moment = require('moment');
var MaterialTypeLoader = require('../../../../loader/spinning-material-types-loader');
var UnitLoader = require('../../../../loader/unit-loader');
var ProductLoader = require('../../../../loader/product-loader');
var CountLoader = require('../../../../loader/master-count-loader');

@inject(Service, CoreService)
export class DataForm {
    @bindable isCreate = false;
    @bindable isEdit = false;
    @bindable isView = false;
    @bindable readOnly;
    @bindable data = {};
    @bindable error;
    @bindable title;

    @bindable yarnType;
    @bindable count = {};
    @bindable detailOptions;
    @bindable unit;

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        editText: "Ubah",
        deleteText: "Hapus",
    };

    controlOptions = {
        label: {
            length: 2
        },
        control: {
            length: 5
        }
    }
    controlOptions3 = {
        label: {
            length: 1
        },
        control: {
            length: 5
        }
    }
    controlOptions2 = {
        label: {
            length: 4
        },
        control: {
            length: 7
        }
    }
    mixDrawing = false;
    // processTypeList = [
    // ];

    detailOptions = {};
    constructor(service, coreService) {
        this.service = service;
        this.coreService = coreService;
        this.detailOptions.service = service;
        this.detailOptions.coreService = coreService;
    }

    bind(context) {
        this.context = context;
        console.log(this.context)
        this.data = this.context.data;
        this.error = this.context.error;

        this.processType = "Pre-Drawing";

        if (!this.data.ProcessType) {
            this.data.ProcessType = this.processType;
        }
        if (!this.data.Id) {
            this.data.Eff = 100;
            this.data.RPM = 1;
            this.data.PD = 1;
            if (this.data.ProcessType == 'Winder') {
                this.data.ConeWeight = 1.89;
            } else {
                this.data.ConeWeight = 1;
            }
        }
        if (this.data.UnitDepartment && this.data.UnitDepartment.Id) {
            this.unit = this.data.UnitDepartment;
        }

        if (this.data.MaterialType && this.data.MaterialType.Id) {
            this.yarnType = this.data.MaterialType;
        }

        if (this.data.Count){
            this.count.Count = this.data.Count;
        }

        this.showItemRegular = true;
        this.mixDrawing = false;
    }

    
    spinningFilter = { "DivisionName.toUpper()": "SPINNING" };
    
    unitChanged(newValue, oldValue) {
        if (this.unit && this.unit.Id) {
            this.data.UnitDepartmentId = this.unit.Id;
            this.detailOptions.UnitDepartmentId = this.unit.Id;
            this.data.MaterialComposition = [];
        }
    }
    
    yarnTypeChanged(n, o) {
        if (this.yarnType && this.yarnType.Id) {
            this.data.MaterialTypeId = this.yarnType.Id;
        }
    }

    countChanged(n, o) {
        if (this.count && this.count.Id) {
            this.data.Count = this.count.Count;
        }
    }

    get yarnLoader() {
        return ProductLoader;
    }

    get materialTypeLoader() {
        return MaterialTypeLoader;
    }

    get unitLoader() {
        return UnitLoader;
    }

    get countLoader(){
        return CountLoader;
    }

    @computedFrom('data.RPM', 'data.Eff', 'data.PD')
    get CapacityPerShift() {
        let CapacityPerShift = ((60 * 8 * this.data.RPM * (this.data.Eff/100) * 2)/(768 * 400 * (50/this.data.PD)));

        this.data.CapacityPerShift = CapacityPerShift;
        CapacityPerShift = numeral(CapacityPerShift).format();

        return CapacityPerShift;
    }

    @computedFrom('data.CapacityPerShift')
    get CapacityPerKg() {
        let CapacityPerKg = (181.44 * this.data.CapacityPerShift);

        this.data.CapacityPerKg = CapacityPerKg;
        CapacityPerKg = numeral(CapacityPerKg).format();

        return CapacityPerKg;
    }

    @computedFrom('data.CapacityPerShift')
    get CapacityPerDay() {
        let CapacityPerDay = (3 * this.data.CapacityPerShift);

        this.data.CapacityPerDay = CapacityPerDay;
        CapacityPerDay = numeral(CapacityPerDay).format();

        return CapacityPerDay;
    }
} 
