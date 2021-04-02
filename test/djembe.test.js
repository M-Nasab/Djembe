import { Djembe } from '../src/djembe';

describe('djembe', () => {
    it('Should have a `tick` method', () => {
        const djembe = Djembe();

        expect(djembe).toHaveProperty('tick');
        expect(typeof djembe.tick).toBe('function');
    });

    it('Should have a `subscribe` method', () => {
        const djembe = Djembe();

        expect(djembe).toHaveProperty('subscribe');
        expect(typeof djembe.subscribe).toBe('function');
    });

    it('Should return an `unsubscribe` method on subscription', () => {
        const djembe = Djembe();

        const unsubscribe = djembe.subscribe(jest.fn());

        expect(typeof unsubscribe).toBe('function');
    });

    it('Should emit tick events', () => {
        const djembe = Djembe({
            steps: 5,
            steppers: 3,
            ticks: [
                {
                    step: 1,
                    stepper: 0,
                    data: { // some arbitrary data
                        volume: 50,
                    },
                },
                {
                    step: 1,
                    stepper: 1,
                    data: {
                        volume: 50,
                    },
                },
            ],
        });

        const mockSubscriber = jest.fn();

        djembe.subscribe(mockSubscriber);

        djembe.tick();

        expect(mockSubscriber).toBeCalledWith({
            ticks: [
                {
                    step: 1,
                    stepper: 0,
                    data: {
                        volume: 50,
                    },
                }
            ],
            state: [
                {
                    step: 1,
                    stepper: 0,
                },
                {
                    step: 0,
                    stepper: 1,
                },
                {
                    step: 0,
                    stepper: 2,
                },
            ],
        });

        for(let i = 0; i < 4; i++) {
            djembe.tick();
        }

        expect(mockSubscriber).toBeCalledWith({
            ticks: [
                {
                    step: 1,
                    stepper: 1,
                    data: {
                        volume: 50,
                    },
                }
            ],
            state: [
                {
                    step: 0,
                    stepper: 0,
                },
                {
                    step: 1,
                    stepper: 1,
                },
                {
                    step: 0,
                    stepper: 2,
                },
            ],
        });
    });

    it('Should unsubscribe work correctly', () => {
        const djembe = Djembe();

        const mockSubscriber = jest.fn();
        const unsubscribe = djembe.subscribe(mockSubscriber);

        djembe.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);

        unsubscribe();

        djembe.tick();

        expect(mockSubscriber).toHaveBeenCalledTimes(1);
    });

    it('Should throw error if size is too small', () => {
        const create = () => {
            Djembe({
                steps: 1,
            });
        };

        expect(create).toThrow();
    });
});