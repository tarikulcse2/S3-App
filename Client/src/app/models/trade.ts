export interface ITrade {
    id: number;
    tradeId: number;
    level: number;
    languageList: Array<any>;
    language: any;
    syllabusName: string;
    syllbusFileName: string;
    planFileName: string;
    devOffer: string;
    manager: string;
    activeDate: Date;
    entyDate: Date;
    updateDate: Date;
}
