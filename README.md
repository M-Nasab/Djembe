# Djembe

[![Build Status](https://travis-ci.org/M-Nasab/djembe.svg?branch=main)](https://travis-ci.org/M-Nasab/djembe)
[![NPM Package](https://img.shields.io/npm/v/djembe)](https://www.npmjs.com/package/djembe)

A rhythm maker which emits any data with the given rhythm periodically

## Installation

```
npm install --save djembe
```
## Usage

import { Djembe } from 'djembe';

// create an emitter with initial state [0, 0, 0]
const djembe = Djembe({
    steps: 4,
    steppers: 3,
    ticks: [
        {
            step: 1,
            stepper: 0,
            data: { // some arbitrary data
                intensity: 1,
            },
        },
        {
            step: 0,
            stepper: 0,
            data: {
                intensity: 0.5,
            },
        },
        {
            step: 1,
            stepper: 1,
            data: {
                intensity: 0.8,
            },
        },
    ],
});

djembe.subscribe((event) => {
    console.log(event);
});

djembe.tick(); // [{ step: 1, stepper: 0, data: { intensity: 1 } }]
djembe.tick(); // []
djembe.tick(); // []
djembe.tick(); // [{ step: 0, stepper: 0, data: { intensity: 0.5 } }, { step: 1, stepper: 1, data: { intensity: 0.8 } }]

```

## Test

```
npm run test
```

## License

MIT