import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public users = [];
  public posts = [];
  public isLoading: any;

  constructor(
    private db: AngularFireDatabase,
    private toastr:ToastrService
  ) { }

  async ngOnInit() {
    await this.getUsers();
    await this.getPosts();
  }

  getUsers() {
    this.isLoading = true;
    this.db.object('/users').valueChanges()
    .subscribe(response => {
      console.log("Userx", response);   
      if(response) {
        this.users = Object.values(response);
        this.isLoading = false;
      }
      else {
        this.toastr.error("Something went wrong","ERROR",{
          closeButton: true
        });
        this.isLoading = false;
        this.users = [];
      }
    })
  }


  getPosts() {
    this.isLoading = true;
    this.db.object('/posts').valueChanges()
    .subscribe(response => {
      if(response) {
        this.posts = Object.values(response).sort((a, b) => b.date - a.date);
        this.isLoading = false;
      }
      else {
        this.toastr.error("Something went wrong","ERROR",{
          closeButton: true
        });
        this.posts = [];
        this.isLoading = false;
      }
    })
  }
}
