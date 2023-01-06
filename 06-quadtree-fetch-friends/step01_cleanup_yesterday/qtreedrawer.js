


class QuadTreeDrawer {
  constructor(tree) {
    this.tree = tree;
  }

  drawBounds() {
    let box = this.tree.bounds;
    rectMode(CORNER);
    rect(box.origin.x, box.origin.y, box.size.width, box.size.height);
  }

  drawPoint(point) {
    rectMode(CENTER);
    rect(point.x, point.y, 10, 10);
  }

  drawPoints(color) {
    rectMode(CENTER);
    //fill(102);
    noFill();
    stroke(color);
    this.tree.points.forEach(point => {
      this.drawPoint(point);
    });
  }

//====================================================================== STATIC
  static drawSubTrees(parent, level) {
    //console.log("Bounds drawer level:", level);
    parent.subTrees.forEach(tree => {
      if (tree.subTrees.length != 0) {
        QuadTreeDrawer.drawSubTrees(tree, level + 1);
      } else {
        QuadTreeDrawer.drawBounds(tree);
      }
    });
  }

  static drawBounds(tree) {
    noFill();

    let box = tree.bounds;
    //console.log(box)
    rectMode(CORNER);
    rect(box.origin.x, box.origin.y, box.size.width, box.size.height);
  }

  static drawSubPoints(parent, level, c) {
    //console.log("Points drawer level:", level);

    let newColor = c;
    //newColor.setAlpha(255 - (level * 30));
    //console.log(255 - (level * 10), newColor);
    parent.subTrees.forEach(tree => {
      if (tree.subTrees.length != 0) {
        QuadTreeDrawer.drawSubPoints(tree, level+1, newColor);
      } else {
        QuadTreeDrawer.drawPoints(tree, newColor);
      }
    });
  }

  static drawPoints(tree, c) {
      stroke(c);
      rectMode(CENTER);
      noFill();
      tree.points.forEach(point => {
        QuadTreeDrawer.drawPoint(point, c);
      });
  }

  static drawPoint(point, c) {
    stroke(c);
    ellipseMode(CENTER);
    ellipse(point.x, point.y, 8, 8);
  }

}
