import {SVGSelection} from "../../../map/models/types";
import {mouse, select} from "d3-selection";
import {Context} from "../../../map/models/context";

export class SelectionTool {
  private selection: SVGSelection;
  private path;
  private context: Context;

  public connect(selection: SVGSelection, context: Context) {
    this.selection = selection;
    this.context = context;
  }

  public activate() {
    const self = this;

    const transformation = (p) => {
      const transformation_point = this.context.getZeroZeroTransformationPoint();
      return [p[0] - transformation_point.x, p[1] - transformation_point.y];
    };


    this.selection.on("mousedown", function() {
      const subject = select(window);
      const parent = this.parentElement;

      const start = transformation(mouse(parent));
      self.startSelection(start);

      subject
        .on("mousemove.selection", function() {
          self.moveSelection(start, transformation(mouse(parent)));
        }).on("mouseup.selection", function() {
          self.endSelection(start, transformation(mouse(parent)));
          subject
            .on("mousemove.selection", null)
            .on("mouseup.selection", null);
        });
    });
  }

  public deactivate() {
    this.selection.on('mousedown', null);
  }

  public draw(selection: SVGSelection, context: Context) {
    const canvas = selection.select<SVGGElement>("g.canvas");

    if (!canvas.select<SVGGElement>("g.selection-line-tool").node()) {
      const g = canvas.append<SVGGElement>('g');
      g.attr("class", "selection-line-tool");

      this.path = g.append("path");
      this.path
        .attr("class", "selection")
        .attr("visibility", "hidden");
    }
    this.selection = selection;
  }

  private startSelection(start) {
    this.path
      .attr("d", this.rect(start[0], start[1], 0, 0))
      .attr("visibility", "visible");
  }

  private moveSelection(start, move) {
    this.path.attr("d", this.rect(start[0], start[1], move[0] - start[0], move[1] - start[1]));
  }

  private endSelection(start, end) {
    this.path.attr("visibility", "hidden");
  }

  private rect(x: number, y: number, w: number, h: number) {
    return "M" + [x, y] + " l" + [w, 0] + " l" + [0, h] + " l" + [-w, 0] + "z";
  }
}
