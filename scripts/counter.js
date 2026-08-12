// counter.js

export class Counter {
    constructor(target, minAverage, history, value) {
        this.target = target;
        this.minAverage = minAverage;
        this.history = history.split(',').map(i => Number(i));
        this.history.shift();
        this.value = value;
        this.isValueOk = this.value > this.minAverage;
        this.total = 0;
    }
    calculateTotal() {
        for (let i = 0; i < this.history.length; i ++) {
            this.total += this.history[i];
        }
        return this.total;
    }
    calculateRemaining() {
        return this.target - this.total;
    }
    calculateAverage() {
        return this.total / (this.history.length);
    }
    calculateMax() {
        return Math.max(...this.history);
    }
    calculateMin() {
        return Math.min(...this.history);
    }
    calculateIterations() {
        return this.history.length;
    }
    calculatePercentage() {
        return (this.total / this.target) * 100;
    }
}