import React, { useContext, useEffect, useState } from "react";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip, TrainClass } from "../../types/trainTypes";
import TripNotFound from "./TripNotFound";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import i18n from "../../i18n";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Box,
  Grid,
  Chip
} from "@mui/material";
import {
  Train as TrainIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Payments as PaymentsIcon,
  Straighten as DistanceIcon
} from "@mui/icons-material";

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
  const { t } = useTranslation();

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="class-select-label">{t("tripDetails.selectClass")}</InputLabel>
      <Select
        labelId="class-select-label"
        id="class-select"
        value={selected}
        label={t("tripDetails.selectClass")}
        onChange={(e) => onSelect(e.target.value)}
      >
        {trip.train.classes.map((cls) => (
          <MenuItem key={cls.id} value={cls.id}>
            {cls.name} — {cls.cost} EGP
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const TripDetailsSection = ({ trip }: Props) => {
  const { selectedClass, selectedTrip, setSelectedClass } = useContext(TrainsContext);
  const [editing, setEditing] = useState(false);
  const [localClassId, setLocalClassId] = useState(selectedClass?.id || "");
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

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
          {t("tripDetails.title")} from {trip.station_from.name} to {trip.station_to.name}
        </title>
        <meta
          name="description"
          content={`${t("tripDetails.train")}: ${trip.station_from.name} to ${trip.station_to.name}, departs at ${trip.start_time}, arrives at ${trip.finish_time}`}
        />
        <meta name="keywords" content="train, booking, trip details, travel" />
      </Helmet>

      <Card sx={{ maxWidth: 600, mx: 'auto', my: 4, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {t("tripDetails.title")}
            </Typography>
            <Button
              onClick={handleEditToggle}
              startIcon={editing ? <CancelIcon /> : <EditIcon />}
              variant="contained"
              color={editing ? "error" : "primary"}
            >
              {editing ? t("tripDetails.cancel") : t("tripDetails.editClass")}
            </Button>
          </Box>

          <Grid container spacing={2}>
            {/* Train Info */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <TrainIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.train")}:</strong> {trip.train.name}
                </Typography>
              </Box>
            </Grid>

            {/* Stations */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.from")}:</strong> {trip.station_from.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.to")}:</strong> {trip.station_to.name}
                </Typography>
              </Box>
            </Grid>

            {/* Times */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.departure")}:</strong> {trip.start_time}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.arrival")}:</strong> {trip.finish_time}
                </Typography>
              </Box>
            </Grid>

            {/* Distance */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <DistanceIcon color="primary" />
                <Typography variant="body1">
                  <strong>{t("tripDetails.distance")}:</strong> {selectedTrip?.distance} km
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Class Selection */}
          {editing ? (
            <>
              <ClassSelector
                trip={trip}
                selected={localClassId}
                onSelect={handleClassChange}
              />
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <PaymentsIcon color="info" />
                <Typography variant="body2" color="text.secondary">
                  {t("tripDetails.selectedClass")}: {isRTL ? selectedClass?.arDesc : selectedClass?.enDesc} — 
                  <Chip label={`${selectedClass?.cost} EGP`} size="small" sx={{ ml: 1 }} />
                </Typography>
              </Box>
            </>
          ) : (
            <Box display="flex" alignItems="center" gap={1}>
              <PaymentsIcon color="primary" />
              <Typography variant="body1">
                <strong>{t("tripDetails.selectedClass")}:</strong> {selectedClass?.name} — 
                <Chip label={`${selectedClass?.cost} EGP`} size="small" sx={{ ml: 1 }} />
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};