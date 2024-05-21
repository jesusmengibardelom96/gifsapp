import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'eo7J4jXcQ6XE7ge7fCy3laErddRziWiq'

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []

  private _tagHistory: string[] = []
  private apiKey: string = GIPHY_API_KEY
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor( private http: HttpClient ) {
    this.loadLocalStorage()
    console.log('Gifs service ready');

  }

  get tagsHistory() {
    return [...this._tagHistory]
  }

  private orgaizeHistory(tag:string):void {
    tag = tag.toLowerCase()

    if(this._tagHistory.includes(tag)){
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagHistory.unshift(tag)
    this._tagHistory.splice(10)
    this.saveLocalStorage()
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory))
  }

  private loadLocalStorage():void {
    if(!localStorage.getItem('history')) return

    this._tagHistory = JSON.parse(localStorage.getItem('history')!)

    if(this._tagHistory.length <= 0) return

    this.searchTag(this._tagHistory[0])
  }

  public searchTag(tag: string):void {

    if( tag.length === 0) return

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', 10)
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params }).subscribe( resp => {
      this.gifList = resp.data
    })

    this.orgaizeHistory(tag)

  }
}
