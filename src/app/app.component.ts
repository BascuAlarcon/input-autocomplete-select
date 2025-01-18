import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, startWith, map, forkJoin } from 'rxjs'; 
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { PokemonService } from './pokemon.service';
import { MatPaginator } from '@angular/material/paginator'; 
import { ViewChild } from '@angular/core';

export interface PeriodicElement { 
  id: number;
  pokedex: number;
  image: string; // official-artwork
  type: string[];
  name: string;
  height: number;
  weight: number; 
}

var ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, AfterViewInit{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  pokemonsList: string[] = []; 
  filteredPokemons!: Observable<string[]>;
  selectedPokemons: string[] = [];
  allPokemons: string[] = [];
  pokemonCtrl = new FormControl('');
  opcionPokemon = new FormControl<string[]>([]);  
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA); 
  selectedClient: string = '';
  displayedColumns: string[] = ['pokedex', 'image', 'type', 'name', 'height', 'weight' ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pokemonService: PokemonService){}

  ngOnInit(): void {     
    this.obtenerListaAsignaciones() 
    this.filteredPokemons = this.pokemonCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPokemon(value || ''))
    );  
  } 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  limpiarFiltros(): void {
    this.selectedPokemons = []; 
  
    this.pokemonCtrl.reset();  

    this.applyFilter(); 
  }

  obtenerListaAsignaciones() { 
    ELEMENT_DATA = [];
    this.pokemonService.getPokemonList().subscribe({
      next: (response: any) => { 
        const results = response.results;  
        
        const requests = results.map((pokemon: any) => 
          this.pokemonService.getPokemonDetails(pokemon.url)  
        );



        // Ejecutar todas las solicitudes concurrentemente
        forkJoin<any[]>(requests).subscribe({
          next: (details: any[]) => { 
            ELEMENT_DATA = details.map((detail, index) => ({ 
              id: index + 1, // Incremental
              pokedex: detail.order, // Número en la Pokédex
              image: detail.sprites.other['official-artwork']?.front_default || '', // Imagen del Pokémon
              type: detail.types.map((t: any) => t.type.name).join(', '), // Tipos del Pokémon
              name: detail.name, // Nombre
              height: detail.height,  // Altura
              weight: detail.weight,  // Peso
            }));

            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;

            // Llenar la lista de nombres de Pokémon
            this.pokemonsList = details.map((detail) => detail.name); 
            this.setListaPokemon(this.pokemonsList);
            this.pokemonCtrl.setValue('');
          },
          error: (error: any) => {
            console.error('Error al obtener los detalles de los Pokémon:', error);
          }
        });  

        // for (let index = 0; index < results.length; index++) {
        //   this.pokemonsList.push(results[index].name)
        // }
        // console.log(this.pokemonsList)
        // this.pokemonsList = [...new Set(this.pokemonsList)];
        // this.setListaPokemon(this.pokemonsList); 
        // this.pokemonCtrl.setValue('');  
      },
      error: (error) => {
        console.error('Error al obtener los datos de la API:', error);
      }
    }); 
  }

  setListaPokemon(pokemonList: string[]) {  
    this.allPokemons = pokemonList || []
  }

  private _filterPokemon(value: string): string[] {
    const filterValue = value.toLowerCase(); 
    return this.pokemonsList.filter(pokemon => 
      pokemon.toLowerCase().includes(filterValue) && 
      !this.selectedPokemons.includes(pokemon)  
    );
  }

  selectPokemon(event: any): void {
    const pokemon = event.option.value;
    if (!this.selectedPokemons.includes(pokemon)) {
      this.selectedPokemons.push(pokemon);
      this.opcionPokemon.setValue(this.selectedPokemons);  
      this.pokemonCtrl.setValue('');  
    } 
    this.applyFilter();
  }

  addPokemon(event: any): void {
    const value = (event.value || '').trim();
    this.filteredPokemons.subscribe((Pokemons) => { 
      if (Pokemons.includes(value) && !this.selectedPokemons.includes(value)) {
        this.selectedPokemons.push(value);
        this.opcionPokemon.setValue(this.selectedPokemons); 
      } 
   
      event.chipInput!.clear();
      this.pokemonCtrl.setValue('');  
      this.clearInputPokemon();
    });
  }

  removePokemon(pokemon: string): void {
    const index = this.selectedPokemons.indexOf(pokemon);
    if (index >= 0) {
      this.selectedPokemons.splice(index, 1);
      this.opcionPokemon.setValue(this.selectedPokemons);
      this.pokemonCtrl.setValue('')
    }
    this.applyFilter();
  } 

  onPokemonInput(event: any): void {
    const filterValue = event.target.value.toLowerCase(); 
    this.filteredPokemons = this.filterPokemons(filterValue); // Filtra por lo que escribe el usuario 
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => { 
      const pokemonMatch = data.name.toLowerCase().includes(filter);
      return pokemonMatch;   
    };
    
    this.dataSource.filter = filterValue;  }

  filterPokemons(filterValue: string): Observable<string[]> {
    return new Observable(observer => {
      if (filterValue) {
        observer.next(this.allPokemons.filter(pokemon => pokemon.toLowerCase().includes(filterValue)));
      } else {
        observer.next(this.allPokemons);
      }
    });
  }

  clearInputPokemon() { 
    this.pokemonCtrl.setValue('');  
    this.opcionPokemon.setValue(this.selectedPokemons);
  }

  truncateName(name: string): string {
    const maxLength = 50; 
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + '...';  
    }
    return name;   
  }

  applyFilter() { 
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => { 
      const pokemonMatch = this.selectedPokemons.length === 0 || this.selectedPokemons.some(pokemon =>
        data.name.toLowerCase().includes(pokemon.toLowerCase())
      ); 
      
      // Permitir coincidencias parciales en el filtro de pokemon (insensible a mayúsculas)
      const clientMatch = this.selectedClient === '' || data.name.toLowerCase().includes(this.selectedClient.toLowerCase());
      
      return pokemonMatch;
    };
  
    this.dataSource.filter = Math.random().toString(); // Forzar el filtrado
  }
} 

