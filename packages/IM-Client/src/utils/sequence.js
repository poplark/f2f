let sequence = 1;

export function resetSequence() {
  sequence = 1;
}

export function getSequence() {
  let res = `${Date.now()}_${sequence}`;
  sequence += 1;
  return res;
}
