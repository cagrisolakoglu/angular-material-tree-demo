import { Component, Input, OnInit } from '@angular/core';
import { ITreeModel } from 'src/app/models/tree-item.model';
import { TreeDataServiceServiceProvider } from 'src/app/services/tree-data-service.service';


@Component({
  selector: 'app-cs-tree',
  templateUrl: './cs-tree.component.html',
  styleUrls: ['./cs-tree.component.scss'],
  providers: [TreeDataServiceServiceProvider]
})
export class CsTreeComponent implements OnInit {

  @Input() public treeDataSource: ITreeModel<any> = {
    keyPropertyName: "id",
    valuePropertyName: "name",
    childPropertyName: "children",
    data: []
  };

  dataSource: ITreeModel<any> = {
    keyPropertyName: "id",
    valuePropertyName: "name",
    childPropertyName: "children",
    data: []
  };


  constructor(private dataService: TreeDataServiceServiceProvider) {

    dataService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

   }

  ngOnInit(): void {
    if (this.treeDataSource.data.length > 0) {
      const data = this.dataService.createDataSource(this.treeDataSource);
      this.dataService.dataChange.next(data);
    }
  }

}
