


export class Timer {
    startTime: number;    // replace with the more modern timezone-sensitive one
    paused?: number;      // keep track of last time paused
    endTime: number;      // may be modified
    constructor(millis: number) {
        this.startTime = Date.now();
        this.endTime = Date.now() + millis;
    }

    alive() {
        return this.remaining() > 0;
    }

    remaining() {
        return this.endTime - (this.paused ? this.paused : Date.now());
    }

    increment(millis: number) {
        this.endTime += millis;
    }

    pause() {   // idempotent
        if (!this.paused)
            this.paused = Date.now();
    }

    resume() {  // does nothing if unpaused
        if (this.paused)
            this.endTime += Date.now() - this.paused;
        this.paused = undefined;
    }
}

export function seconds(millis: number) {
    return (millis - (millis % 1000)) / 1000;
}