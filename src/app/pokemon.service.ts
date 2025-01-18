import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0';

  constructor(private http: HttpClient) {}

  getPokemonList(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url);  
  }
  
}
