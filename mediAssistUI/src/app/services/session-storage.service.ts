import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService extends StorageService {
  private _storage = sessionStorage;

  constructor() {
    super();
  }

  protected get storage(): Storage {
    return this._storage;
  }
}
