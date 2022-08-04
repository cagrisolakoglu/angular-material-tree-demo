import { Component, OnInit } from '@angular/core';
import { ITreeModel } from 'src/app/components/ubys-tree/models/tree-item.model';
import { ITreeDemoModel } from './model/tree-demo.model';

@Component({
  selector: 'app-tree-demo',
  templateUrl: './tree-demo.component.html'
})
export class TreeDemoComponent implements OnInit {
  isFilterable: boolean;
  isMultiSelectable: boolean;
  dataSource: ITreeModel<ITreeDemoModel[]>;
  tempDataSource: ITreeDemoModel[] = [{
    id: "1",
    title: "1",
    children: [{
      id: "1.1", title: "1.1",
      children: [{
        id: "1.1.1", title: "1.1.1",
        children: []
      }]
    },
    {
      id: "1.2",
      title: "1.2",
      children: [
        { id: "1.2.1", title: "1.2.1", children: [] },
        { id: "1.2.2", title: "1.2.2", children: [] },
        { id: "1.2.3", title: "1.2.3", children: [] },
        { id: "1.2.4", title: "1.2.4", children: [] },
        { id: "1.2.5", title: "1.2.5", children: [] },
      ]
    },
    {
      id: "1.3", title: "1.3", children: [
        { id: "1.3.1", title: "1.3.1", children: [] },
        { id: "1.3.2", title: "1.3.2", children: [] },
        { id: "1.3.3", title: "1.3.3", children: [] },
        { id: "1.3.4", title: "1.3.4", children: [] },
      ]
    }
    ]
  },
  {
    id: "2",
    title: "2",
    children: [
      { id: "2.1", title: "2.1", children: [] },
      { id: "2.2", title: "2.2", children: [] },
      { id: "2.3", title: "2.3", children: [] }
    ]
  },
  {
    id: "3",
    title: "3",
    children: [
      { id: "3.1", title: "3.1", children: [] },
      { id: "3.2", title: "3.2", children: [] },
      { id: "3.3", title: "3.3", children: [] },
      { id: "3.4", title: "3.4", children: [] },
      { id: "3.5", title: "3.5", children: [] },
    ]
  },
  {
    id: "4",
    title: "4",
    children: [
      { id: "4.1", title: "4.1", children: [] },
      { id: "4.2", title: "4.2", children: [] },
      { id: "4.3", title: "4.3", children: [] },
    ]
  }];

  constructor() {
    this.isFilterable = true;
    this.isMultiSelectable = false;
    this.dataSource = {
      keyPropertyName: "id",
      valuePropertyName: "title",
      childPropertyName: "children",
      data: this.tempDataSource
    };

  }

  ngOnInit() {


  }

}
