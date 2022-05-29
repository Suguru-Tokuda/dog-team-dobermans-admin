import moment from "moment";

export default class DateTimeService {
    static getDateRangeOptions() {
        return [
            { label: 'Last 30 days', id: 1 },
            { label: 'Last 2 months', id: 2 },
            { label: 'Last 6 months', id: 3 },
            { label: 'Last 12 months', id: 4 },
            { label: 'Last 2 Years', id: 5 },
            { label: 'Custom Range', id: 6 }
        ];
    }

    static getDateRangeByID(dateRangeID) {
        const index = this.getDateRangeOptions().map(option => option.id).indexOf(dateRangeID);
        let retVal;

        switch (index) {
            case 0:
                retVal = {
                    startDate: moment().subtract(30, 'days').startOf('day').toDate().toISOString(),
                    endDate: moment().endOf('day').toDate().toISOString()
                };
                break;
            case 1:
                retVal = {
                    startDate: moment().subtract(2, 'months').startOf('day').toDate().toISOString(),
                    endDate: moment().endOf('day').toDate().toISOString()
                };
                break;
            case 2:
                retVal = {
                    startDate: moment().subtract(6, 'months').startOf('day').toDate().toISOString(),
                    endDate: moment().endOf('day').toDate().toISOString()
                };
                break;
            case 3:
                retVal = {
                    startDate: moment().subtract(12, 'months').startOf('day').toDate().toISOString(),
                    endDate: moment().endOf('day').toDate().toISOString()
                };
                break;
            case 4:
                retVal = {
                    startDate: moment().subtract(2, 'years').startOf('day').toDate().toISOString(),
                    endDate: moment().endOf('day').toDate().toISOString()
                };
                break;
        }

        return retVal;
    }
}