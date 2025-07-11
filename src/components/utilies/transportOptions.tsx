import React from "react";
import { TransportOption } from "../../types/types";
import {
  DirectionsBus,
  DirectionsCar,
  DirectionsRailway,
} from "@mui/icons-material";

export const transportOptions: TransportOption[] = [
  {
    id: 1,
    label: "transport.bus",
    icon: <DirectionsBus />,
    value: "bus",
    hasRoundTrip: true,
  },
  // {
  //   id: 2,
  //   label: "transport.private",
  //   icon: <DirectionsCar />,
  //   value: "private",
  //   hasRoundTrip: true,
  // },
  // {
  //   id: 3,
  //   label: "transport.train",
  //   icon: <DirectionsRailway />,
  //   value: "train",
  //   hasRoundTrip: true,
  // },
];
