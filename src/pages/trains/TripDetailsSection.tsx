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
import TripNotFound from "./TripNotFound";
import { useTranslation } from "react-i18next";  // Import useTranslation hook

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
        onChange={(e) => onSelect(e.target.value)}
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
  const { t } = useTranslation();  // Use the translation hook

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
    return <TripNotFound onBack={() => window.history.back()} />;
  }

  return (
    <>
      <Helmet>
        <title>
          {t('tripDetails.title')} from {trip.station_from.name} to {trip.station_to.name}
        </title>
        <meta
          name="description"
          content={`${t('tripDetails.train')}: ${trip.station_from.name} to ${trip.station_to.name}, departs at ${trip.start_time}, arrives at ${trip.finish_time}`}
        />
        <meta name="keywords" content="train, booking, trip details, travel" />
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
            {t('tripDetails.title')}
          </Typography>
          <Button size="small" onClick={handleEditToggle}>
            {editing ? t('tripDetails.cancel') : t('tripDetails.editClass')}
          </Button>
        </Box>

        <Typography variant="body1" sx={{ my: 0.5 }}>
          <TrainIcon color="primary" sx={{ mr: 1 }} /> <strong>{t('tripDetails.train')}:</strong>{" "}
          {trip.train.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <LocationOn color="primary" sx={{ mr: 1 }} /> <strong>{t('tripDetails.from')}:</strong>{" "}
          {trip.station_from.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <LocationOn color="error" sx={{ mr: 1 }} /> <strong>{t('tripDetails.to')}:</strong>{" "}
          {trip.station_to.name}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <Event color="success" sx={{ mr: 1 }} /> <strong>{t('tripDetails.departure')}:</strong>{" "}
          {trip.start_time}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <Event color="secondary" sx={{ mr: 1 }} /> <strong>{t('tripDetails.arrival')}:</strong>{" "}
          {trip.finish_time}
        </Typography>
        <Typography variant="body1" sx={{ my: 0.5 }}>
          <AccessTime color="warning" sx={{ mr: 1 }} /> <strong>{t('tripDetails.distance')}:</strong>{" "}
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
              {t('tripDetails.selectedClass')}: {selectedClass?.name} — {selectedClass?.cost} EGP
            </Typography>
          </>
        ) : (
          <Typography variant="body1" sx={{ my: 0.5 }}>
            <PriceChange color="disabled" sx={{ mr: 1 }} />{" "}
            <strong>{t('tripDetails.selectedClass')}:</strong>{" "}
            <Chip label={`${selectedClass?.name} (${selectedClass?.cost} EGP)`} />
          </Typography>
        )}
      </Box>
    </>
  );
};
