import { epicles } from 'epicles';

const DEFAULT_OPTIONS = {
    steps: 32,
    steppers: 7,
    ticks: [],
};

export function Djembe(opts = {}) {
    let subscribers = [];

    const options = {
        ...DEFAULT_OPTIONS,
        ...opts,
    };

    const {
        steps,
        steppers,
        initialState,
    } = options;

    let { ticks } = options;

    const epicle = epicles({
        steps,
        steppers,
        initialState,
    });

    epicle.subscribe(handleTickEvents);

    function handleTickEvents(events) {
        const emittedTicks = ticks.filter((tick) => {
            const shouldBeEmitted = !!events.find((event) => {
                return (event.step === tick.step) && (event.stepper === tick.stepper);
            });

            return shouldBeEmitted;
        });

        const state = epicle.getState();

        emit(emittedTicks, state);
        
    }

    function emit(ticks, state) {
        subscribers.forEach((subscriber) => {
            subscriber({
                ticks,
                state,
            });
        });
    }
    
    function tick() {
        epicle.tick();
    }

    function subscribe(callback) {
        if (subscribers.find(callback)) return;

        subscribers.push(callback);

        const unsubscribe = function () {
            subscribers = subscribers.filter((subscriber) => subscriber !== callback);
        };

        return unsubscribe;
    }

    function setTicks (nextTicks) {
        ticks = nextTicks;
    }

    return {
        subscribe,
        tick,
        setTicks,
    };
}
