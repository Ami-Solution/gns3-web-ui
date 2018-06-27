import { anything, instance, mock, verify } from "ts-mockito";
import { Selection } from "d3-selection";


import { TestSVGCanvas } from "../testing";
import { Layer } from "../models/layer";
import { LinksWidget } from "./links";
import { Node } from "../models/node";
import { Link } from "../models/link";
import { InterfaceLabelWidget } from "./interface-label";


describe('LinksWidget', () => {
  let svg: TestSVGCanvas;
  let widget: LinksWidget;
  let layersEnter: Selection<SVGGElement, Layer, SVGGElement, any>;
  let layer: Layer;

  beforeEach(() => {
    svg = new TestSVGCanvas();
    widget = new LinksWidget();

    const node_1 = new Node();
    node_1.node_id = "1";
    node_1.x = 10;
    node_1.y = 10;

    const node_2 = new Node();
    node_2.node_id = "2";
    node_2.x = 100;
    node_2.y = 100;

    const link_1 = new Link();
    link_1.link_id = "link1";
    link_1.source = node_1;
    link_1.target = node_2;
    link_1.link_type = "ethernet";

    layer = new Layer();
    layer.index = 1;

    layer.links = [link_1];

    const layers = [layer];

    const layersSelection = svg.canvas
        .selectAll<SVGGElement, Layer>('g.layer')
        .data(layers);

    layersEnter = layersSelection
        .enter()
            .append<SVGGElement>('g')
            .attr('class', 'layer');

    layersSelection
        .exit()
            .remove();
  });

  afterEach(() => {
    svg.destroy();
  });

  it('should draw links', () => {
    const interfaceLabelWidgetMock = mock(InterfaceLabelWidget);
    const interfaceLabelWidget = instance(interfaceLabelWidgetMock);
    spyOn(widget, 'getInterfaceLabelWidget').and.returnValue(interfaceLabelWidget);

    widget.draw(layersEnter);

    const drew = svg.canvas.selectAll<SVGGElement, Link>('g.link');
    const linkNode = drew.nodes()[0];
    expect(linkNode.getAttribute('link_id')).toEqual('link1');
    expect(linkNode.getAttribute('map-source')).toEqual('1');
    expect(linkNode.getAttribute('map-target')).toEqual('2');
    expect(linkNode.getAttribute('transform')).toEqual('translate (0, 0)');

    verify(interfaceLabelWidgetMock.draw(anything())).called();
  });

});
