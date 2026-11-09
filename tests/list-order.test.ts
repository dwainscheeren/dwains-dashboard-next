import { describe, expect, it } from 'vitest';
import { mergeReorderedSubset, moveItemTo, sameItems, sameOrder } from '../src/utils/list-order';

describe('moveItemTo', () => {
  it('moves an item forwards and backwards', () => {
    expect(moveItemTo(['a', 'b', 'c', 'd'], 'a', 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItemTo(['a', 'b', 'c', 'd'], 'd', 0)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('returns the same array when nothing changes', () => {
    const order = ['a', 'b', 'c'];
    expect(moveItemTo(order, 'b', 1)).toBe(order);
    expect(moveItemTo(order, 'x', 0)).toBe(order);
  });

  it('keeps the index inside the list', () => {
    expect(moveItemTo(['a', 'b', 'c'], 'a', 10)).toEqual(['b', 'c', 'a']);
    expect(moveItemTo(['a', 'b', 'c'], 'c', -3)).toEqual(['c', 'a', 'b']);
  });

  it('does not change the order it is given', () => {
    const order = ['a', 'b', 'c'];
    moveItemTo(order, 'a', 2);
    expect(order).toEqual(['a', 'b', 'c']);
  });
});

describe('sameItems and sameOrder', () => {
  it('compares the items', () => {
    expect(sameItems(['a', 'b'], ['b', 'a'])).toBe(true);
    expect(sameItems(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(sameItems(['a'], ['a', 'b'])).toBe(false);
  });

  it('compares the order', () => {
    expect(sameOrder(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(sameOrder(['a', 'b'], ['b', 'a'])).toBe(false);
  });
});

describe('mergeReorderedSubset', () => {
  it('keeps hidden items in place while the shown ones change order', () => {
    // b and d are hidden; the page showed a, c, e and moved e to the front.
    expect(mergeReorderedSubset(['a', 'b', 'c', 'd', 'e'], ['e', 'a', 'c'])).toEqual(['e', 'b', 'a', 'd', 'c']);
  });

  it('adds shown items that were not stored yet at the end', () => {
    expect(mergeReorderedSubset(['a', 'hidden'], ['new', 'a'])).toEqual(['new', 'hidden', 'a']);
  });

  it('works without a stored order and drops duplicates', () => {
    expect(mergeReorderedSubset([], ['b', 'a'])).toEqual(['b', 'a']);
    expect(mergeReorderedSubset(['a', 'a', 'b'], ['b', 'a'])).toEqual(['b', 'a']);
  });
});
