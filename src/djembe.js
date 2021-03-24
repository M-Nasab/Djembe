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
        ticks,
    } = options;

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

        emit(emittedTicks);
        
    }

    function emit(events) {
        subscribers.forEach((subscriber) => {
            subscriber(events);
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

    return {
        subscribe,
        tick,
    };
}
