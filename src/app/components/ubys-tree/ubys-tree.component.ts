import { Component, Input, OnInit } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { FlatTreeNode, ITreeModel, TreeNode } from './models/tree-item.model';
import { TreeDataServiceServiceProvider } from './services/tree-data-service.service';

@Component({
  selector: 'app-ubys-tree',
  templateUrl: './ubys-tree.component.html',
  styleUrls: ['./ubys-tree.component.scss'],
  providers: [TreeDataServiceServiceProvider]
})
export class UbysTreeComponent implements OnInit {

  //==============================================//
  //=>variables
  //==============================================//
  // @Input() public isCheckable: boolean = false;
  // @Input() public isEditable: boolean = false;
  // @Input() public isDeletable: boolean = false;
  // @Input() public isAddable: boolean = false;
  // @Input() public isExpandable: boolean = false;
  // @Input() public isCollapsable: boolean = false;
  // @Input() public isDraggable: boolean = false;
  // @Input() public isDroppable: boolean = false;
  // @Input() public isSelectable: boolean = false;

  // @Input() public isCheckboxVisible: boolean = false;
  // @Input() public isCheckboxDisabled: boolean = false;
  // @Input() public isCheckboxIndeterminate: boolean = false;
  // @Input() public isCheckboxChecked: boolean = false;
  // @Input() public isCheckboxIndeterminateDisabled: boolean = false;
  // @Input() public isCheckboxCheckedDisabled: boolean = false;
  @Input() public isFilterable: boolean = false;
  @Input() public isMultiSelectable: boolean = true;
  @Input() public treeDataSource: ITreeModel<any> = {
    keyPropertyName: "id",
    valuePropertyName: "name",
    childPropertyName: "children",
    data: []
  };

  @Input() public removeParentChildNodeDependency: boolean = false;

  //**********************************************//

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FlatTreeNode, TreeNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TreeNode, FlatTreeNode>();

  /** A selected parent node to be inserted */
  selectedParent: FlatTreeNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<FlatTreeNode>;

  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;

  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;

  /** The selection for checklist */

  checklistSelection = new SelectionModel<FlatTreeNode>(true);


  constructor(private dataService: TreeDataServiceServiceProvider) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<FlatTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



    dataService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  ngOnInit(): void {
    if (this.treeDataSource.data.length > 0) {
      // this.dataSource.data = this.dataService.createDataSource(this.treeDataSource);
      const data = this.dataService.createDataSource(this.treeDataSource);
      this.dataService.dataChange.next(data);
    }
  }


  getLevel = (node: FlatTreeNode) => node.level;

  isExpandable = (node: FlatTreeNode) => node.expandable;

  getChildren = (node: TreeNode): TreeNode[] => node.children;

  hasChild = (_: number, _nodeData: FlatTreeNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FlatTreeNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name ? existingNode : new FlatTreeNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  treeItemSelectionToggle(node: FlatTreeNode): void {

    if (!this.removeParentChildNodeDependency) {
      this.checklistSelection.toggle(node);
    }

    const descendants = this.treeControl.getDescendants(node);
    console.log('descendants', descendants);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));

    if (!this.removeParentChildNodeDependency) {
      this.checkAllParentsSelection(node);
    }

  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  treeLeafItemSelectionToggle(node: FlatTreeNode): void {
    console.log('node', node);
    if (!this.removeParentChildNodeDependency) {
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
    }

  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatTreeNode): void {
    let parent: FlatTreeNode | null = this.getParentNode(node);
    while (parent) {
      if (!this.removeParentChildNodeDependency) {
        this.checkRootNodeSelection(parent);
      }

      parent = this.getParentNode(parent);
    }

    console.log(this.checklistSelection.selected);
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatTreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }

  }

  /* Get the parent node of a node */
  getParentNode(node: FlatTreeNode): FlatTreeNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  // /** Select the category so we can insert the new item. */
  // addNewItem(node: FlatTreeNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  // /** Save the node to database */
  // saveNode(node: FlatTreeNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }


  // pass mat input string to recursive function and return data
  filterTree(filterText: string) {
    // use filter input text, return filtered TREE_DATA, use the 'name' object value

    const data = this.dataService.createDataSource(this.treeDataSource);
    const data2 = this.filterRecursive(filterText, data, "name");
    // Notify the change.
    this.dataService.dataChange.next(data2);
  }

  // filter string from mat input filter
  applyFilter(filterText: string) {
    this.filterTree(filterText);
    // show / hide based on state of filter string
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  // filter recursively on a text string using property object value
  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData: any[] = [];

    //make a copy of the data so we don't mutate the original
    function copy(o: any) {
      return Object.assign({}, o);
    }

    // has string
    if (filterText) {
      // need the string to match the property value
      filterText = filterText.toLowerCase();
      // copy obj so we don't mutate it and filter
      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().includes(filterText)) {
          return true;
        }
        // if children match
        if (y.children) {
          return (y.children = y.children.map(copy).filter(x)).length;
        }
      });
      // no string, return whole array
    } else {
      filteredData = this.dataSource.data;
    }
    return filteredData;
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }
}
