import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, filter } from 'rxjs/operators';


import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';





const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  
  private heroesUrl = 'api/heroes';

  constructor(
     private http: HttpClient,
    private messageService: MessageService) { }
  
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
  // TODO: send the message _after_ fetching the heroes
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched ${heroes.length} heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
  // TODO: send the message _after_ fetching the heroes
    this.log(`fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap( _ => this.log(`updated hero id= ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    ) 
  }

  addHero(hero: Hero): Observable<any>{
    return this.http.post(this.heroesUrl, hero, httpOptions).pipe(
      tap( _ => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    ) 
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
