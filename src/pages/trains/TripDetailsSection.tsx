import React, { useContext, useEffect, useState } from "react";
import { TrainsContext } from "../../context/TrainsContext";
import { Trip, TrainClass } from "../../types/trainTypes";
import TripNotFound from "./TripNotFound";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { Helmet } from "react-helmet-async";
import i18n from "../../i18n";

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

  const { t } = useTranslation();  // Use the translation hook

  const options = trip.train.classes.map((cls) => (
    <option key={cls.id} value={cls.id}>
      {cls.name} — {cls.cost} EGP
    </option>
  ));

  return (
    <div style={{ marginTop: "16px" }}>
      <label htmlFor="class-select">{t("tripDetails.selectClass")}</label>
      <select
        id="class-select"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        style={{ width: "100%", padding: "8px", marginTop: "8px" }}
      >
        {options}
      </select>
    </div>
  );
};

export const TripDetailsSection = ({ trip }: Props) => {
    const { selectedClass, selectedTrip, setSelectedClass } =
    useContext(TrainsContext);
  const [editing, setEditing] = useState(false);
  const [localClassId, setLocalClassId] = useState(selectedClass?.id || "");
  const { t } = useTranslation();  // Use the translation hook
  const isRTL = i18n.language === "ar"; // Check if the current language is Arabic

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
          maxWidth: "500px",
          margin: "auto",
          padding: "24px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ fontWeight: "bold" }}>{t("tripDetails.title")}</h5>
          <button onClick={handleEditToggle} style={{ padding: "8px 16px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
            {editing ? t("tripDetails.cancel") : t("tripDetails.editClass")}
          </button>
        </div>

        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>🚆</span><strong>{t("tripDetails.train")}:</strong> {trip.train.name}
        </p>
        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>📍</span><strong>{t("tripDetails.from")}:</strong> {trip.station_from.name}
        </p>
        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>📍</span><strong>{t("tripDetails.to")}:</strong> {trip.station_to.name}
        </p>
        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>⏳</span><strong>{t("tripDetails.departure")}:</strong> {trip.start_time}
        </p>
        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>⏳</span><strong>{t("tripDetails.arrival")}:</strong> {trip.finish_time}
        </p>
        <p style={{ margin: "8px 0" }}>
          <span style={{ marginRight: "8px" }}>⏰</span><strong>{t("tripDetails.distance")}:</strong> {selectedTrip?.distance} km
        </p>

        {editing ? (
          <>
            <ClassSelector
              trip={trip}
              selected={localClassId}
              onSelect={handleClassChange}
            />
            <p style={{ fontSize: "12px", color: "#6c757d", marginTop: "8px" }}>
              {t("tripDetails.selectedClass")}: {isRTL ? selectedClass?.arDesc : selectedClass?.enDesc }  — {selectedClass?.cost} EGP
            </p>
          </>
        ) : (
          <p style={{ margin: "8px 0" }}>
            <span style={{ marginRight: "8px" }}>💲</span><strong>{t("tripDetails.selectedClass")}:</strong>{" "}
            <span>{selectedClass?.name} ({selectedClass?.cost} EGP)</span>
          </p>
        )}
      </div>
    </>
  );
};
