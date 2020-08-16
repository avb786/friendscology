import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { readAndCompressImage  } from "browser-image-resizer";
import { Imageconfig } from "../../../utils/config";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public picture: any;
  public uploadPercent: any;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    public route:Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit(f: NgForm){

    const {email, password, username, country, bio, name} = f.form.value;
    
    this.auth.signUp(email, password)
    .then(res => {      
      this.db.object('/users/' + res.user.uid)
      .set({
        id:  res.user.uid,
        name: name,
        username: username,
        email: email,
        bio: bio,
        country: country,
        picture:  this.picture
      })
      
    })
    .then(() => {
      this.route.navigateByUrl('/signin');
      this.toastr.success('Sign up success');
      window.location.reload();
    })
    .catch(err => {
      this.toastr.error('Sign up Failed')

    })

  }

  async uploadFile(event) {
    const file = event.target.files[0];
    let resizeedImage = await readAndCompressImage(file, Imageconfig);
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath, resizeedImage)

    task.percentageChanges().subscribe(res => {
      this.uploadPercent = res;

    });
    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(res => {
          this.picture = res;
          this.toastr.success('Image uploaded successfully')
        })
      })
    )
    .subscribe();

  }


}
