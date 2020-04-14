import entries from 'core-js/features/object/entries';

import { Adapter, AdapterCreator, AdapterOptions, IterateActivitiesOptions } from '../types/AdapterTypes';

function reservedKey(key) {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

// Only create adapter when activities is being iterated.
export default function createLazy<TActivity>() {
  return (next: AdapterCreator<TActivity>) => (options: AdapterOptions): Adapter<TActivity> => {
    let adapter;

    const lazy = {
      activities: (options?: IterateActivitiesOptions) => {
        if (!adapter) {
          adapter = next(options);

          entries(adapter).forEach(([key, value]) => {
            if (!reservedKey(key)) {
              lazy[key] = typeof value === 'function' ? value.bind(lazy) : value;
            }
          });
        }

        return adapter.activities(options);
      },

      addEventListener: () => {
        throw new Error('You must call activities() first.');
      },

      close: () => {
        throw new Error('You must call activities() first.');
      },

      dispatchEvent: () => {
        throw new Error('You must call activities() first.');
      },

      egress: () => {
        throw new Error('You must call activities() first.');
      },

      ingress: () => {
        throw new Error('You must call activities() first.');
      },

      removeEventListener: () => {
        throw new Error('You must call activities() first.');
      }
    };

    return lazy;
  };
}