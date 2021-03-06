import { Injectable, EventEmitter } from "@angular/core";
import { DraggedDataEvent, ResizedDataEvent } from "./event-source";
import { MapDrawing } from "../models/map/map-drawing";


@Injectable()
export class DrawingsEventSource {
  public dragged = new EventEmitter<DraggedDataEvent<MapDrawing>>();
  public resized = new EventEmitter<ResizedDataEvent<MapDrawing>>();
  public textEdited = new EventEmitter<any>();
}
