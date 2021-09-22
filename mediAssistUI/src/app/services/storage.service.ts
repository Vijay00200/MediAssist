import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class StorageService {
  private itemSources: Map<string, BehaviorSubject<string | null>> = new Map();
  protected abstract get storage(): Storage;

  constructor() {
    addEventListener('storage', (event: StorageEvent) => {
      if (event.key) {
        if (this.itemSources.has(event.key)) {
          this.itemSources.get(event.key)?.next(event.newValue);
        }
      }
    });
  }

  private isValidJSON(value: string): boolean {
    let obj;
    try {
      obj = JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  hasItem(key: string): boolean {
    return this.itemSources.has(key);
  }

  getItemAsValue<T>(key: string): T {
    let val = this.storage.getItem(key);
    return (this.isValidJSON(val!) ? JSON.parse(val!) : val!) as T;
  }

  getItem<T>(key: string): Observable<T> | undefined {
    if (!this.itemSources.has(key)) {
      this.itemSources.set(
        key,
        new BehaviorSubject<string | null>(this.storage.getItem(key))
      );
    }

    return this.itemSources.get(key)?.pipe(
      map((val) => {
        return (this.isValidJSON(val!) ? JSON.parse(val!) : val!) as T;
      })
    );
  }

  setItem<T>(key: string, value: T) {
    try {
      this.storage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      );
      if (this.itemSources.has(key)) {
        this.itemSources.get(key)?.next(this.storage.getItem(key));
      }
    } catch (error) {
      this.itemSources.get(key)?.error(error);
    }
  }

  removeItem(key: string) {
    this.storage.removeItem(key);

    if (this.itemSources.has(key)) {
      this.itemSources.get(key)?.next(this.storage.getItem(key)); // Expect to be null
      this.itemSources.delete(key);
    }
  }

  clear() {
    this.storage.clear();
    this.itemSources.forEach((itemSource: BehaviorSubject<string | null>) => {
      itemSource.next(null);
      itemSource.complete();
    });

    this.itemSources.clear();
  }
}
