export interface ITreeNode<T> {
  id: string;
  name: string;
  level: number;
  data: T;
  children: ITreeNode<T>[];
}

export interface ITreeModel<T> {
  keyPropertyName: string;
  valuePropertyName: string;
  childPropertyName: string;
  data: T;
}

/** Node for tree item */
export class TreeNode {
  constructor() {
    this.id = "";
    this.name = "";
    this.children = [];
  }
  public id: string;
  public name: string;
  public children: TreeNode[];
}

/** Flat tree item node with expandable and level information */
export class FlatTreeNode {
  constructor() {
    this.id = "";
    this.name = "";
    this.level = 0;
    this.expandable = false;
  }
  public id: string;
  public name: string;
  public level: number;
  public expandable: boolean;
}
