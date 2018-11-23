import { Injectable } from "@angular/core";

import { Converter } from "../converter";
import { Label } from "../../models/label";
import { MapLabel } from "../../models/map/map-label";


@Injectable()
export class LabelToMapLabelConverter implements Converter<Label, MapLabel> {
    convert(label: Label, paramaters?: {[node_id: string]: string}) {
        const mapLabel = new MapLabel();
        mapLabel.rotation = label.rotation;
        mapLabel.style = label.style;
        mapLabel.text = label.text;
        mapLabel.x = label.x;
        mapLabel.y = label.y;
        if (paramaters !== undefined) {
          mapLabel.id = paramaters.node_id;
          mapLabel.nodeId = paramaters.node_id;
        }
        return mapLabel;
    }
}
