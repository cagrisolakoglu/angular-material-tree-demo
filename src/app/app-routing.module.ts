import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeDemoComponent } from './pages/tree-demo/tree-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TreeDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
