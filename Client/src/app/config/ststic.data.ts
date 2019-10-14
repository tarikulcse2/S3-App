export abstract class StaticDate {
    static levelList(): any[] {
        return [
            { id: 1, tradeId: 1, name: 'F-L-1' },
            { id: 2, tradeId: 1, name: 'F-L-2' },
            { id: 3, tradeId: 1, name: 'F-L-3' },
            { id: 4, tradeId: 2, name: 'S-L-1' },
            { id: 5, tradeId: 2, name: 'S-L-2' },
            { id: 6, tradeId: 3, name: 'T-L-3' },
            { id: 7, tradeId: 3, name: 'T-L-3' },
            { id: 8, tradeId: 3, name: 'T-L-3' },
        ];
    }

    static languageList(): any[] {
        return [
            { isChecked: false, value: 'EN', name: 'English' },
            { isChecked: false, value: 'BA', name: 'Bangla' },
            { isChecked: false, value: 'TA', name: 'Tanil' },
            { isChecked: false, value: 'CH', name: 'Chainese' },
            { isChecked: false, value: 'KO', name: 'Korean' }
        ];
    }
}
