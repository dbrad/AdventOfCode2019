export class NTree {
  /**
   * @memberof NTree
   * @param {NTreeNode} node
   * @returns {NTree}
   */
  withRootNode(node) {
    this.root = node;
    return this;
  }

  /**
   * @memberof NTree
   * @param {number} depth
   * @returns {NTreeNode[]}
   */
  getChildren(depth = 0) {
    let children = [...this.root.children];
    while (depth > 0) {
      const temp = [];
      for (const child of children) {
        if (child && child.children) {
          temp.push(...child.children);
        }
      }
      children = [...temp];
      depth--;
    }
    return children;
  }
}

export class NTreeNode {
  /**
   * @memberof NTreeNode
   * @param {string} name
   * @returns {NTreeNode}
   */
  withName(name) {
    this.name = name;
    return this;
  }

  /**
   * @memberof NTreeNode
   * @param {[number, number]} pos
   * @returns {NTreeNode}
   */
  withPosition(pos) {
    this.pos = pos;
    return this;
  }

  /**
   * @memberof NTreeNode
   * @param {number} distance
   * @returns {NTreeNode}
   */
  withDistance(distance) {
    this.distance = distance;
    return this;
  }

  /**
   * @memberof NTreeNode
   * @param {NTreeNode} node
   * @returns {NTreeNode}
   */
  withParent(node) {
    this.parent = node;
    return this;
  }

  /**
   * @memberof NTreeNode
   * @param {NTreeNode} node
   * @returns {NTreeNode}
   */
  addChild(node) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
    node.parent = this;
    return this;
  }

  /**
   * @readonly
   * @memberof NTreeNode
   * @returns {number}
   */
  get totalDistance() {
    let next = this.parent;
    let distance = this.distance;
    while (next) {
      distance += next.distance;
      next = next.parent;
    }
    return distance;
  }

  /**
   * @readonly
   * @memberof NTreeNode
   * @returns {string[]}
   */
  get keys() {
    if (this.name === "@") {
      return [];
    }
    let next = this.parent;
    let keys = [this.name];
    while (next && next.name !== "@") {
      keys.push(next.name);
      next = next.parent;
    }
    return keys;
  }
}
