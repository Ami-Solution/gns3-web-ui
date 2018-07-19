import { Widget } from "./widget";
import { Drawing } from "../models/drawing";
import { SVGSelection } from "../models/types";
import { Layer } from "../models/layer";
import { TextDrawingWidget } from "./drawings/text-drawing";
import { SvgToDrawingConverter } from "../helpers/svg-to-drawing-converter";
import { ImageDrawingWidget } from "./drawings/image-drawing";
import { RectDrawingWidget } from "./drawings/rect-drawing";
import { LineDrawingWidget } from "./drawings/line-drawing";
import { EllipseDrawingWidget } from "./drawings/ellipse-drawing";
import { DrawingWidget } from "./drawings/drawing-widget";


export class DrawingsWidget implements Widget {
  private svgToDrawingConverter: SvgToDrawingConverter;
  private drawingWidgets: DrawingWidget[] = [
    new TextDrawingWidget(),
    new ImageDrawingWidget(),
    new RectDrawingWidget(),
    new LineDrawingWidget(),
    new EllipseDrawingWidget()
  ];

  constructor() {
    this.svgToDrawingConverter = new SvgToDrawingConverter();
  }

  public draw(view: SVGSelection, drawings?: Drawing[]) {
    const drawing = view
      .selectAll<SVGGElement, Drawing>('g.drawing')
      .data((l: Layer) => {
        l.drawings.forEach((d: Drawing) => {
          try {
            d.element = this.svgToDrawingConverter.convert(d.svg);
          } catch (error) {
            console.log(`Cannot convert due to Error: '${error}'`);
          }
        });
        return l.drawings;
      }, (d: Drawing) => {
        return d.drawing_id;
      });

    const drawing_enter = drawing.enter()
      .append<SVGGElement>('g')
      .attr('class', 'drawing');

    const drawing_merge = drawing.merge(drawing_enter)
      .attr('transform', (d: Drawing) => {
        return `translate(${d.x},${d.y}) rotate(${d.rotation})`;
      });

    this.drawingWidgets.forEach((widget) => {
      widget.draw(drawing_merge);
    });

    drawing
      .exit()
        .remove();

  }
}
