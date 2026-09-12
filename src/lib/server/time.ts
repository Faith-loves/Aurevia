import "temporal-polyfill/full/global";

export function databaseNow() {
  return Temporal.Now.instant();
}
