# maya-calculator-parser

Typescript package to parse plaintext calculations and create operators for Maya calendar dates.

## Installation

```bash
npm install @drewsonne/maya-calculator-parser
```

## Compatibility

maya-calculator-parser requires:

- **Node.js**: >= 20.0.0
- **maya-dates**: >= 1.3.0

### Supported maya-dates Versions

| maya-dates | maya-calculator-parser |
|------------|------------------------|
| 1.3.x      | ✓ Supported            |
| 1.4.x+     | ✓ Supported            |
| 2.x        | ❌ Not yet supported    |

We follow [semantic versioning](https://semver.org/). Minor version updates of maya-dates (1.3 → 1.4) should work without changes.

## Usage

```typescript
import { parseCalendarRound, parseLongCount } from '@drewsonne/maya-calculator-parser';

// Parse Calendar Round dates
const cr = parseCalendarRound('4 Ajaw 8 Kumk\'u');

// Parse Long Count dates
const lc = parseLongCount('9.2.10.10.10');
```

## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

## License

GPL-3.0

## Author

Drew J. Sonne <drew.sonne@gmail.com>
