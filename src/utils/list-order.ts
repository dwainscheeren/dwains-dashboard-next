// Live reordering of the order lists in the settings: while an item is
// dragged the list shows the new order, and the order is saved on drop.

/**
 * The order with `item` moved to `index`. Returns the same array when nothing
 * changes, so a drag over the item's own place does not render again.
 */
export function moveItemTo<T>(order: readonly T[], item: T, index: number): readonly T[] {
  const from = order.indexOf(item);
  if (from === -1) return order;
  const to = Math.max(0, Math.min(order.length - 1, Math.trunc(index)));
  if (from === to) return order;
  const next = [...order];
  next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Whether both lists hold the same items, in any order. */
export function sameItems<T>(left: readonly T[], right: readonly T[]): boolean {
  if (left.length !== right.length) return false;
  const items = new Set(left);
  return items.size === new Set(right).size && right.every((item) => items.has(item));
}

/** Whether both lists hold the same items in the same order. */
export function sameOrder<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

/**
 * A stored order after some of its items were reordered: `reordered` is the
 * new order of the items that were shown, the others (hidden ones) keep their
 * place. Items of `reordered` missing from `existing` are added at the end.
 */
export function mergeReorderedSubset<T>(existing: readonly T[], reordered: readonly T[]): T[] {
  const unique = existing.filter((item, index) => existing.indexOf(item) === index);
  const base = [...unique, ...reordered.filter((item) => !unique.includes(item))];
  const moved = new Set(reordered);
  let next = 0;
  return base.map((item) => (moved.has(item) ? (reordered[next++] as T) : item));
}
