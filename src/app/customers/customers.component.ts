import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Customer } from '../model/customer.model';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  //Les variables
  customers! : Observable<Array<Customer>>;
  errorMessage! : string;
  searchFormGroup! : FormGroup;

  //Injection des dépendances
  constructor(
    private customersService:CustomersService,
    private fb:FormBuilder,
    private router:Router) { }

  ngOnInit(): void {

    //Recupération des customers | le .pipe pour gérer le cas ou il y aura erreur
    this.customers = this.customersService.getCustomers().pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );

    //Utilisation d'un formulaire pour recherche d'un customer|Déclaration des champs qu'on veut dans notre formulaire
    this.searchFormGroup = this.fb.group({
        keyword : this.fb.control("")
    });
  }

  //Méthode pour la recherche
  handleSearchCustomers(){
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customersService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  //Méthode pour la suppression
  handleDeleteCustomer(c:Customer){
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.customersService.deleteCustomer(c.id).subscribe({
      next : resp => {
        this.customers = this.customers.pipe(
          map(data=>{
            let index = data.indexOf(c);
            data.splice(index,1)
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer:Customer){
    this.router.navigateByUrl("/customer-accounts/"+customer.id,{state:customer})
  }

}
