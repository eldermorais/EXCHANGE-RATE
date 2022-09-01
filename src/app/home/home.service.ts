import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrentExchangeRate, DailyExchangeRate } from './home.component';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(public http: HttpClient) { }

  getCurrentExchangeRate(symbol:string): Observable<CurrentExchangeRate> {
    return this.http.get<CurrentExchangeRate>(
      `${environment.baeUrl}/currentExchangeRate?apiKey=${environment.apiKey}&from_symbol=${symbol}&to_symbol=BRL`
      );
  }

  getDailyExchangeRate(symbol:string): Observable<DailyExchangeRate> {
    return this.http.get<DailyExchangeRate>(
      `${environment.baeUrl}/dailyExchangeRate?apiKey=${environment.apiKey}&from_symbol=${symbol}&to_symbol=BRL`
      );
  }
}
