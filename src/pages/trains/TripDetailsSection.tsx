import React, { useContext, useEffect, useState } from "react";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip, TrainClass } from "../../types/trainTypes";
import TripNotFound from "./TripNotFound";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import i18n from "../../i18n";
import {
  Train as TrainIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Payments as PaymentsIcon,
  Straighten as DistanceIcon,
  ArrowForward as ArrowForwardIcon
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

  const options = trip.train.classes.map((cls) => (
    <option key={cls.id} value={cls.id}>
      {cls.name} — {cls.cost} EGP
    </option>
  ));

  return (
    <div style={{ marginTop: "16px" }}>
      <label htmlFor="class-select" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
        {t("tripDetails.selectClass")}
      </label>
      <select
        id="class-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "16px",
          backgroundColor: "#fff"
        }}
      >
        {options}
      </select>
    </div>
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

      <div
        style={{
          maxWidth: "600px",
          margin: "24px auto",
          padding: "24px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          border: "1px solid #eee"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontWeight: "600", fontSize: "20px", margin: 0 }}>
            {t("tripDetails.title")}
          </h2>
          <button 
            onClick={handleEditToggle}
            style={{
              padding: "8px 16px",
              background: editing ? "#ff4444" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {editing ? (
              <>
                <CancelIcon style={{ fontSize: "18px" }} />
                {t("tripDetails.cancel")}
              </>
            ) : (
              <>
                <EditIcon style={{ fontSize: "18px" }} />
                {t("tripDetails.editClass")}
              </>
            )}
          </button>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {/* Train Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <TrainIcon style={{ color: "#007bff", fontSize: "20px" }} />
            <div>
              <strong style={{ fontWeight: "500" }}>{t("tripDetails.train")}:</strong> {trip.train.name}
            </div>
          </div>

          {/* Stations */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 200px" }}>
              <LocationIcon style={{ color: "#007bff", fontSize: "20px" }} />
              <div>
                <strong style={{ fontWeight: "500" }}>{t("tripDetails.from")}:</strong> {trip.station_from.name}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
              <ArrowForwardIcon style={{ color: "#666", fontSize: "20px" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 200px" }}>
              <LocationIcon style={{ color: "#007bff", fontSize: "20px" }} />
              <div>
                <strong style={{ fontWeight: "500" }}>{t("tripDetails.to")}:</strong> {trip.station_to.name}
              </div>
            </div>
          </div>

          {/* Times */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 200px" }}>
              <ScheduleIcon style={{ color: "#007bff", fontSize: "20px" }} />
              <div>
                <strong style={{ fontWeight: "500" }}>{t("tripDetails.departure")}:</strong> {trip.start_time}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 200px" }}>
              <ScheduleIcon style={{ color: "#007bff", fontSize: "20px" }} />
              <div>
                <strong style={{ fontWeight: "500" }}>{t("tripDetails.arrival")}:</strong> {trip.finish_time}
              </div>
            </div>
          </div>

          {/* Distance */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <DistanceIcon style={{ color: "#007bff", fontSize: "20px" }} />
            <div>
              <strong style={{ fontWeight: "500" }}>{t("tripDetails.distance")}:</strong> {selectedTrip?.distance} km
            </div>
          </div>
        </div>

        <div style={{ height: "1px", background: "#eee", margin: "24px 0" }}></div>

        {/* Class Selection */}
        {editing ? (
          <>
            <ClassSelector
              trip={trip}
              selected={localClassId}
              onSelect={handleClassChange}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
              <PaymentsIcon style={{ color: "#007bff", fontSize: "20px" }} />
              <div style={{ fontSize: "14px", color: "#666" }}>
                {t("tripDetails.selectedClass")}: {isRTL ? selectedClass?.arDesc : selectedClass?.enDesc} — 
                <span style={{
                  display: "inline-block",
                  background: "#e3f2fd",
                  color: "#007bff",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  marginLeft: "8px",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>
                  {selectedClass?.cost} EGP
                </span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <PaymentsIcon style={{ color: "#007bff", fontSize: "20px" }} />
            <div>
              <strong style={{ fontWeight: "500" }}>{t("tripDetails.selectedClass")}:</strong> {selectedClass?.name} — 
              <span style={{
                display: "inline-block",
                background: "#e3f2fd",
                color: "#007bff",
                padding: "4px 8px",
                borderRadius: "12px",
                marginLeft: "8px",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                {selectedClass?.cost} EGP
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};