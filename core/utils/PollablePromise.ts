

export type state = "pending" | "resolved" | "rejected";

export class PollablePromise<T> {
    state: state;
    p: Promise<T>;
    result?: T;
    reason?: string;
    constructor(p: Promise<T>, timeout?: number) {
        this.state = "pending";
        this.p = timeout ? new Promise((resolve, reject) => {
            setTimeout(() => reject("timeout"), timeout);
            p.then(value => resolve(value));
        }) : p;
        this.p.then(value => { this.result = value; this.state = "resolved" }, reason => { this.reason = reason; this.state = "rejected" });
    }

    completed() {
        return this.state !== "pending";
    }

    resolved() {
        return this.state === "resolved";
    }

    rejected() {
        return this.state === "rejected";
    }

    value() {
        return this.resolved() ? this.result : this.reason;
    }

    // wrap in another promise so that the outer promise can be awaited without disrupting polling
    // trying to await the internal promise will resolve it before the polling can finish
    awaitable() {
        return new Promise<T>((resolve, reject) => {
            this.p.then(value => resolve(value), reason => reject(reason));
        });
    }

    // add an action to perform each poll until the promise resolves. Returns the promise to be awaited.
    polling(delay: ((iter: number) => number) | number, tick: (iter: number) => void) {
        let i = 0;
        const _poll = () => {
            if (!this.completed()) {
                tick(i);
                setTimeout(_poll, typeof delay === "number" ? delay : delay(i));
                i++;
            }
        };
        _poll();
        return this.p;
    }
}