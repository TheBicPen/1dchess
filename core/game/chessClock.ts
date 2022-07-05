import { Player } from "../models";
import { Timer } from "../utils/Timer";
import { nextPlayer } from "./gameModel";

export interface chessClockRules {
    timeSeconds: number,
    increment: number
}

export class ChessClock {
    clockRules: chessClockRules;
    timers: { [p in Player]: Timer };
    constructor(rules: chessClockRules) {
        this.clockRules = rules;
        this.timers = {
            'w': new Timer(rules.timeSeconds * 1000),
            'b': new Timer(rules.timeSeconds * 1000),
        };
        this.timers.b.pause();
    }
    increment(player: Player) {
        const timer = this.timers[player];
        const timer2 = this.timers[nextPlayer(player)];
        timer.increment(this.clockRules.increment);
        timer.pause();
        timer2.resume();
        return timer.remaining();
    }

    remaining(player: Player){
        this.timers[player].remaining();
    }
}
