import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { readAndCompressImage  } from "browser-image-resizer";
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {
@Input() post;
  public uid: any;
  public upvote = 0;
  public downvote = 0;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    public route:Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.auth.getUser().subscribe(res => {
      this.uid = res.uid;
    })    
  }

  ngOnChanges() {
    if(this.post.vote) {
      Object.values(this.post.vote).map((val: any) => {
        if(val.upvote) {
          this.upvote += 1;
        }
        if(val.downvote) {
          this.downvote += 1;
        }
      } )
    }
  }

  upvotePost() {
    console.log("POSTSSS");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      upvote: 1,
    })
    
  }

  downvotePost() {
    console.log("DOWNpoST");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      downvote: 1,
    })
  }


  // getInstaUrl() {
  //   return ``
  // }

}
