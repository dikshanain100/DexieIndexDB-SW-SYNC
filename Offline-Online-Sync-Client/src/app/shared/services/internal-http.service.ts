import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class InternalHttpService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  /**
   * if you want to pass without headers
   */
  call(data, api, method) { 
    const headers = new HttpHeaders();
    return this.http.request(method, this.config.api_url + api, {
      body: data
    })
  }

  /**
   * if you want to pass headers
   */
  callForHeader(data, api, method, header) {
    return this.http.request(method, this.config.api_url + api, {
      body: data,
      headers: header
    })
  }
}
