import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, startWith, map } from 'rxjs'; 
import { ENTER, COMMA } from '@angular/cdk/keycodes';

export interface PeriodicElement {
  id: number;
  folio: string;
  name: string;
  ubication: string;
  startDate: string; 
  applicatorTechnician: string;
  status: string;
  download?: boolean;
  tecnico_hora_llegada: string;
  tecnico_hora_salida: string;
  servicio: string;
}

var ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  clientesList: string[] = []; 
  filteredClientes!: Observable<string[]>;
  selectedClientes: string[] = [];
  allClientes: string[] = [];
  clienteCtrl = new FormControl('');
  opcionCliente = new FormControl<string[]>([]);  
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA); 
  selectedClient: string = '';
  
  ngOnInit(): void {     
    this.obtenerListaAsignaciones() 
    this.filteredClientes = this.clienteCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCliente(value || ''))
    );  
  } 

  limpiarFiltros(): void {
    this.selectedClientes = []; 
  
    this.clienteCtrl.reset();  

    this.applyFilter(); 
  }

  obtenerListaAsignaciones() { 
    ELEMENT_DATA = [];
    for (let index = 0; index < 4; index++) {
      // push
      this.clientesList.push('5');

    }
    this.clientesList = [...new Set(this.clientesList)];
    this.setListaCliente(this.clientesList); 
    this.clienteCtrl.setValue(''); 
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);

  }

  setListaCliente(clienteList: string[]) {  
    this.allClientes = clienteList || []
  }

  private _filterCliente(value: string): string[] {
    const filterValue = value.toLowerCase(); 
    return this.clientesList.filter(cliente => 
      cliente.toLowerCase().includes(filterValue) && 
      !this.selectedClientes.includes(cliente)  
    );
  }

  selectCliente(event: any): void {
    const cliente = event.option.value;
    if (!this.selectedClientes.includes(cliente)) {
      this.selectedClientes.push(cliente);
      this.opcionCliente.setValue(this.selectedClientes);  
      this.clienteCtrl.setValue('');  
    } 
    this.applyFilter();
  }

  addCliente(event: any): void {
    const value = (event.value || '').trim();
    this.filteredClientes.subscribe((Clientes) => { 
      if (Clientes.includes(value) && !this.selectedClientes.includes(value)) {
        this.selectedClientes.push(value);
        this.opcionCliente.setValue(this.selectedClientes); 
      } 
   
      event.chipInput!.clear();
      this.clienteCtrl.setValue('');  
      this.clearInputCliente();
    });
  }

  removeCliente(cliente: string): void {
    const index = this.selectedClientes.indexOf(cliente);
    if (index >= 0) {
      this.selectedClientes.splice(index, 1);
      this.opcionCliente.setValue(this.selectedClientes);
      this.clienteCtrl.setValue('')
    }
    this.applyFilter();
  } 

  onClienteInput(event: any): void {
    const filterValue = event.target.value.toLowerCase(); 
    this.filteredClientes = this.filterClientes(filterValue); // Filtra por lo que escribe el usuario 
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => { 
      const clienteMatch = data.name.toLowerCase().includes(filter);
      return clienteMatch;   
    };
    
    this.dataSource.filter = filterValue;  }

  filterClientes(filterValue: string): Observable<string[]> {
    return new Observable(observer => {
      if (filterValue) {
        observer.next(this.allClientes.filter(cliente => cliente.toLowerCase().includes(filterValue)));
      } else {
        observer.next(this.allClientes);
      }
    });
  }

  clearInputCliente() { 
    this.clienteCtrl.setValue('');  
    this.opcionCliente.setValue(this.selectedClientes);
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
      const clienteMatch = this.selectedClientes.length === 0 || this.selectedClientes.some(cliente =>
        data.name.toLowerCase().includes(cliente.toLowerCase())
      ); 
      
      // Permitir coincidencias parciales en el filtro de cliente (insensible a mayúsculas)
      const clientMatch = this.selectedClient === '' || data.name.toLowerCase().includes(this.selectedClient.toLowerCase());
      
      return clienteMatch;
    };
  
    this.dataSource.filter = Math.random().toString(); // Forzar el filtrado
  }
}
