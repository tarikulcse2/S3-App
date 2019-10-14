import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUserViewModel } from '../ViewModel/userViewModel';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(private http: HttpClient) { }

  add(userData: FormData) {
    return this.http.post('http://localhost:3300/api/Trade', userData);
  }

  update(userData: FormData) {
    return this.http.put('http://localhost:3300/api/Trade', userData);
  }

  getTrades(page: number, size: number, tradeId: number, level: number) {
    return this.http.get(`http://localhost:3300/api/Trade?page=${page}
    &size=${size}&tradeId=${tradeId}&level=${level}`);
  }

  fileDownload(fileName: string) {
    return this.http.get(`http://localhost:3300/api/Trade?fileName=${fileName}`,
      { reportProgress: true, responseType: 'blob' });

  }
}
