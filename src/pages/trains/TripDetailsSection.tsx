import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Skeleton,
  SelectChangeEvent,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  PriceChange,
  Event,
  Train as TrainIcon,
} from "@mui/icons-material";
import { Helmet } from "react-helmet-async";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip, TrainClass } from "../../types/trainTypes";

type Props = {
  trip: Trip | null;
};

const ClassSelector = ({
  trip,
  selected,
  onSelect,
}: {
  trip: Trip;
  selected: string;
  onSelect: (id: string) => void;
}) => {
  const options = useMemo(
    () =>
      trip.train.classes.map((cls) => (
        <MenuItem key={cls.id} value={cls.id}>
          {cls.name} — {cls.cost} EGP
        </MenuItem>
      )),
    [trip.train.classes]
  );

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="class-select-label">Select Class</InputLabel>
      <Select
        labelId="class-select-label"
        value={selected}
        label="Select Class"
        onChange={(e: SelectChangeEvent<string>) => onSelect(e.target.value)}
      >
        {options}
      </Select>
    </FormControl>
  );
};

export const TripDetailsSection = ({ trip }: Props) => {
  const { selectedClass, selectedTrip, setSelectedClass } =
    useContext(TrainsContext);
  const [editing, setEditing] = useState(false);
  const [localClassId, setLocalClassId] = useState(selectedClass?.id || "");

  useEffect(() => {
    if (!editing && selectedClass) {
      setLocalClassId(selectedClass.id);
    }
  }, [editing, selectedClass]);

  const handleEditToggle = () => {
    setEditing((prev) => !prev);
  };

  const handleClassChange = (newClassId: string) => {
    const foundClass: TrainClass | undefined = trip?.train.classes.find(
      (cls) => cls.id === newClassId
    );
    if (foundClass) {
      setSelectedClass(foundClass);
      setLocalClassId(newClassId);
      setEditing(false);
    }
  };

  if (!trip) {
    return <Skeleton variant="rectangular" height={300} />;
  }

  return (
    <>
      <Helmet>
        <title>
          Trip from {trip.station_from.name} to {trip.station_to.name}
        </title>
        <meta
          name="description"
          content={`Train from ${trip.station_from.name} to ${trip.station_to.name}, departs at ${trip.start_time}, arrives at ${trip.finish_time}`}
        />
        <meta name="keywords" content="train, booking, trip details, travel" />
        <meta
          property="og:title"
          content={`Trip: ${trip.station_from.name} ➜ ${trip.station_to.name}`}
        />
        <meta
          property="og:description"
          content={`From ${trip.station_from.name} to ${trip.station_to.name}. Departure: ${trip.start_time}`}
        />
        <meta property="og:image" content="/assets/train-trip-preview.png" />
        <link rel="canonical" href={`/trips/${trip.id}`} />
      </Helmet>

      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Trip Details
          </Typography>
          <Button size="small" onClick={handleEditToggle}>
            {editing ? "Cancel" : "Edit Class"}
          </Button>
        </Box>

        <Typography variant="body1" sx={{ my: 0.5 }}>
          <TrainIcon color="primary" sx={{ mr: 1 }} /> <strong>Train:</strong>{" "}
          {trip.train.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <LocationOn color="primary" sx={{ mr: 1 }} /> <strong>From:</strong>{" "}
          {trip.station_from.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <LocationOn color="error" sx={{ mr: 1 }} /> <strong>To:</strong>{" "}
          {trip.station_to.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <Event color="success" sx={{ mr: 1 }} /> <strong>Departure:</strong>{" "}
          {trip.start_time}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <Event color="secondary" sx={{ mr: 1 }} /> <strong>Arrival:</strong>{" "}
          {trip.finish_time}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <AccessTime color="warning" sx={{ mr: 1 }} /> <strong>Distance:</strong>{" "}
          {selectedTrip?.distance} km
        </Typography>

        {editing ? (
          <>
            <ClassSelector
              trip={trip}
              selected={localClassId}
              onSelect={handleClassChange}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Currently: {selectedClass?.name} — {selectedClass?.cost} EGP
            </Typography>
          </>
        ) : (
          <Typography variant="body1" sx={{ my: 0.5 }}>
            <PriceChange color="disabled" sx={{ mr: 1 }} />{" "}
            <strong>Selected Class:</strong>{" "}
            <Chip label={`${selectedClass?.name} (${selectedClass?.cost} EGP)`} />
          </Typography>
        )}
      </Box>
    </>
  );
};
