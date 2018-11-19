import { Injectable } from "@angular/core";
import { GraphDataManager } from "../managers/graph-data-manager";
import { InRectangleHelper } from "../helpers/in-rectangle-helper";
import { Subscription } from "rxjs";
import { Rectangle } from "electron";
import { SelectionManager } from "../managers/selection-manager";
import { SelectionEventSource } from "../events/selection-event-source";


@Injectable()
export class SelectionListener {
  private onSelection: Subscription;

  constructor(
    private selectionEventSource: SelectionEventSource,
    private graphDataManager: GraphDataManager,
    private inRectangleHelper: InRectangleHelper,
    private selectionManager: SelectionManager
  ) {
  }

  public onInit(svg: any) {
    this.onSelection = this.selectionEventSource.selected.subscribe((rectangle: Rectangle) => {
      const selectedNodes = this.graphDataManager.getNodes().filter((node) => {
        return this.inRectangleHelper.inRectangle(rectangle, node.x, node.y)
      });
  
      const selectedLinks = this.graphDataManager.getLinks().filter((link) => {
        return this.inRectangleHelper.inRectangle(rectangle, link.x, link.y)
      });
  
      const selectedDrawings = this.graphDataManager.getDrawings().filter((drawing) => {
        return this.inRectangleHelper.inRectangle(rectangle, drawing.x, drawing.y)
      });
  
      const selected = [...selectedNodes, ...selectedLinks, ...selectedDrawings];
  
      this.selectionManager.setSelected(selected);
    });
  }

  public onDestroy() {
    this.onSelection.unsubscribe();
  }
}