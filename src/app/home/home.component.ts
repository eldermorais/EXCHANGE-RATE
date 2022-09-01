import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from './home.service';

export interface CurrentExchangeRate{
  exchangeRate: number;
  fromSymbol: string;
  lastUpdatedAt: string;
  success: boolean;
  toSymbol: string;
}

export interface DailyExchangeRate{    
  from: string;
  lastUpdatedAt: string;
  rateLimitExceeded: boolean;
  success: boolean;
  to: string;
  data: DataDailyExchangeRate[];
}

export interface DataDailyExchangeRate {
  close: number;
  date: number;
  high: number;
  low: number;
  open: number;
  diff: number;
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public loading = false;

  public form: FormGroup;

  public searchResult: CurrentExchangeRate | undefined;

  public listDailyExchangeRate: DataDailyExchangeRate[] | undefined;

  collapsed: boolean = false;

  collapsedIcon: string = this.collapsed ? 'add' : 'remove';

  constructor(
    public service: HomeService,
    private toastr: ToastrService
  ) {
    this.form = new FormGroup({
      search : new FormControl(undefined, [Validators.required])
    })
   }

  
  ngOnInit(): void {
  }

  get search(){
    return this.form.get('search');
  }

  handleLastThirtyDays() {
    this.collapsed = !this.collapsed;
    if(this.collapsed === true && !this.listDailyExchangeRate?.length){
      this.loading = true;
      this.service.getDailyExchangeRate(this.searchResult?.fromSymbol || '').subscribe({next:result => {
        this.loading = false;
        if(result.success === false){
          this.toastr.error('Error querying entered characters.')
        }else {
          
          this.listDailyExchangeRate = result.data.slice(0,29);
          this.listDailyExchangeRate.forEach((item, index, arr)=> {
            let diff = item.close - arr[index+1].close
            if(diff > 0){
              diff = ((item.close - arr[index+1].close)/arr[index+1].close)*100
            }else if (diff < 0){
              diff = ((arr[index+1].close - item.close)/item.close)*-100
            } else {
              diff = 0;
            }
            item.diff = Number(diff.toFixed(4));
          })          
        }        
      },
      error: err => {
        this.loading = false;
      },
      })
    }
  }

  searchCurrentExchange() {
    this.loading = true;
    this.service.getCurrentExchangeRate(this.search?.value).subscribe({next: result => {
      this.loading =false      
      if(result.success === false){
        this.toastr.error('Error querying entered characters.')
      }else {
        this.searchResult = result;
      }      
    },error: err => {
      this.toastr.error('Error performing the query. Try again later.')
      this.loading = false;

    }
    })
  }
  
}
