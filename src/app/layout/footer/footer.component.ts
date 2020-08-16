import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
