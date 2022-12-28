import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentComponent } from './comment/comment.component';

const routes: Routes = [
  { path: 'comment/:text', component: CommentComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
