import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Ad } from '../models/ad.model';
import { environment } from '../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  forUser: boolean;
  message?: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class AdsService {
  constructor(private http: HttpClient) {}

  getAds(query?: string): Observable<Ad[]> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);

    return this.http
      .get<ApiResponse<Ad[]>>(`${environment.apiUrl}/ads`, { params })
      .pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message || 'שגיאה בשרת');
          return res.data || [];
        })
      );
  }

  getAd(id: number): Observable<Ad> {
    return this.http
      .get<ApiResponse<Ad>>(`${environment.apiUrl}/ads/${id}`)
      .pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message || 'מודעה לא נמצאה');
          return res.data!;
        })
      );
  }

  createAd(ad: Ad): Observable<Ad> {
    return this.http
      .post<ApiResponse<Ad>>(`${environment.apiUrl}/ads`, ad, )
      .pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message || 'נכשל ביצירת מודעה');
          return res.data!;
        })
      );
  }

  updateAd(id: number, ad: Ad): Observable<Ad> {
    return this.http
      .put<ApiResponse<Ad>>(`${environment.apiUrl}/ads/${id}`, ad)
      .pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message || 'נכשל בעדכון מודעה');
          return res.data!;
        })
      );
  }

  deleteAd(id: number): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${environment.apiUrl}/ads/${id}`)
      .pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message || 'נכשל במחיקת מודעה');
          return res.data || 'המודעה נמחקה בהצלחה';
        })
      );
  }
}
