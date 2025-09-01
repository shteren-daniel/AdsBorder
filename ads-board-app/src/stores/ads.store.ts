import { inject, computed } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { Ad } from '../models/ad.model';
import { AdsService } from '../services/ad.service';
import { Observable, tap } from 'rxjs';

export interface AdsState {
  ads: Ad[];
  search: string;
}

const initialState: AdsState = {
  ads: [],
  search: '',
};

export const AdsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((state) => ({
    filteredAds: computed(() => {
      const term = state.search();
      if (!term) return state.ads();
      return state
        .ads()
        .filter(
          (ad: Ad) =>
            ad.title.toLowerCase().includes(term) ||
            ad.contact?.toLowerCase().includes(term)
        );
    }),
  })),

  withMethods((store) => {
    const adsService = inject(AdsService);

    return {
      getAllAds() {
        adsService.getAds().subscribe((data: Ad[]) => {
          patchState(store, { ads: data });
        });
      },

      addAd(ad: Ad) {
        return adsService.createAd(ad).pipe(
          tap(() => {
            patchState(store, { ads: [...store.ads(), ad] });
          })
        );
      },

      updateAd(updatedAd: Ad): Observable<Ad> {
        return adsService.updateAd(updatedAd.id, updatedAd).pipe(
          tap(() => {
            patchState(store, {
              ads: store
                .ads()
                .map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)),
            });
          })
        );
      },

      deleteAd(id: number): Observable<string> {
        return adsService.deleteAd(id).pipe(
          tap(() =>
            patchState(store, {
              ads: store.ads().filter((ad) => ad.id !== id),
            })
          )
        );
      },

      setSearch(term: string) {
        patchState(store, { search: term });
      },
    };
  })
);
