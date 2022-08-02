import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})

export class CustomersService {

  //Une variable pour le host du backend|On peut aussi la déclarer directement dans 'src/environments/environment'(dans notre cas)
  //backendHost:string = "http://localhost:8585/";

  constructor(private http:HttpClient) { }

  //Méthode de récupération des clients, peut etre utilisée dans d'autres composants
  public getCustomers():Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(environment.backendHost+"/customers");
  }

  //Méthode de rechercher un client
  public searchCustomers(keyword : string):Observable<Array<Customer>>{
    return this.http.get<Array<Customer>>(environment.backendHost+"/customers/search?keyword="+keyword);
  }

  //Méthode d'ajout de client
  public saveCustomer(customer:Customer):Observable<Customer>{
    return this.http.post<Customer>(environment.backendHost+"/customers/add",customer);
  }

  //Méthode de suppression d'un client
  public deleteCustomer(id:number){
    return this.http.delete(environment.backendHost+"/customers/delete/"+id);
  }
}


