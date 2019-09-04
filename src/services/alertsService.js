export default class AlertsService {
    
    constructor() {
        this.loadingCount = 0;
    }

    showLoading(resetCount, count) {
        if (typeof count === 'number') {
            if (resetCount) {
                this.loadingCount = count;
            } else {
                this.loadingCount += count;
            }
        }
        return this.loadingCount;
    }

    doneLoading(override) {
        if (override) {
            this.loadingCount = 0;
        }
        this.loadingCount -= 1;        
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
        }
        return this.loadingCount;
    }
}