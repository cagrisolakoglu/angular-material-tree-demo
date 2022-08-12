import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITreeModel, ITreeNode } from '../models/tree-item.model';

@Injectable({
  providedIn: 'root'
})
export class TreeDataServiceServiceProvider {
  dataChange = new BehaviorSubject<ITreeNode<any>[]>([]);

  get data(): ITreeNode<any>[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TreeNode` with nested
    // file node as children.
    const data = this.createDataSource({ childPropertyName: 'children', keyPropertyName: 'id', valuePropertyName: 'name', data: [] });

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TreeNode`.
   */
  createDataSource(obj: ITreeModel<any[]>): ITreeNode<any>[] {
    return obj.data.map(item => this.createTreeNode(item, obj.keyPropertyName, obj.valuePropertyName, obj.childPropertyName));
  }

  createTreeNode(
    item: any,
    keyProperty: string,
    valueProperty: string,
    childProperty: string,
    level: number = 0): ITreeNode<any> {
    level++;
    return {
      data: item,
      children: item[childProperty] ? item[childProperty].map((child: any) => this.createTreeNode(child, keyProperty, valueProperty, childProperty, level)) : [],
      level: level,
      id: item[keyProperty],
      name: item[valueProperty]
    };
  }


  /** Add an item to to-do list */
  insertItem(parent: ITreeNode<any>, name: string) {
    if (parent.children) {
      parent.children.push({ name: name } as ITreeNode<any>);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: ITreeNode<any>, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }
}

