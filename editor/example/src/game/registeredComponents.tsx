import {registerComponent} from "rgg-editor";
import React from "react";
import Scenery from "./Scenery";

registerComponent('scenery', 'Scenery', () => <Scenery/>)