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
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  public locationName: any;
  public description: any;
  public picture: any = null;
  public user: any = null;
  public uploadPercent: any = null;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    public route:Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage

  ) { }

  ngOnInit() {
    this.auth.getUser().subscribe(res => {
      this.db.object('/users/'+ res.uid)
      .valueChanges()
      .subscribe(res => {
        this.user = res;
      });
    })
  }

  onSubmit() {
    const uid = uuidv4();
    this.db.object('/posts/'+ uid)
    .set({
      id: uid,
      locationName: this.locationName,
      description: this.description,
      picture: this.picture,
      by: this.user.name,
      userId: this.user.username,
      date: Date.now()
    })
    .then(res => {
      this.toastr.success("Post Added","SUCCESS",{
        closeButton: true
      });
      this.route.navigateByUrl('/')
    })
    .catch(err=>{
      this.toastr.error("Something went wrong","ERROR",{
        closeButton: true
      });
    })
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    let resizeedImage = await readAndCompressImage(file, Imageconfig);
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);

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
