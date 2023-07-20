import { parseAbi } from 'hopfield';
import { seaportHumanReadableAbi } from 'hopfield/test';

import { read } from '../examples/read.js';

// open trace in https://ui.perfetto.dev
const result = read({
  abi: parseAbi(seaportHumanReadableAbi),
  functionName: 'getOrderStatus',
  args: ['0x'],
});
result;
