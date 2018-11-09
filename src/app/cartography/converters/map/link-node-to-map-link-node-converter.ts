import { Injectable } from "@angular/core";

import { Converter } from "./converter";
import { LinkNode } from "../../models/link-node";
import { MapLinkNode } from "../models/map/map-link-node";
import { LabelToMapLabelConverter } from "./label-to-map-label-converter";


@Injectable()
export class LinkNodeToMapLinkNodeConverter implements Converter<LinkNode, MapLinkNode> {
    constructor(
        private labelToMapLabel: LabelToMapLabelConverter
    ) {}
    
    convert(linkNode: LinkNode) {
        const mapLinkNode = new MapLinkNode();
        mapLinkNode.nodeId = linkNode.node_id;
        mapLinkNode.adapterNumber = linkNode.adapter_number;
        mapLinkNode.portNumber = linkNode.port_number;
        mapLinkNode.label = this.labelToMapLabel.convert(linkNode.label);
        return mapLinkNode;
    }
}
