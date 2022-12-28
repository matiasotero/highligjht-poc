import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentSaved!: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router  ) {}

  ngOnInit(): void {
    const comment = this.route.snapshot.paramMap.get('text') ?? "";
    this.commentSaved = comment;
  }

}
