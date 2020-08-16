import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public email = null;


  constructor(
    private authService: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUser().subscribe(response => {
      console.log('USERT', response);
      this.email = response.email;
    }, error => {

    })
  }

  async handleSignOut() {
    try {
      await this.authService.signOut();
      this.route.navigateByUrl('/signin');
      this.toastr.info("Logout Successful");
      this.email = null;

    } catch (error) {
      this.toastr.error("Problem in signout")
    }
  }

}
