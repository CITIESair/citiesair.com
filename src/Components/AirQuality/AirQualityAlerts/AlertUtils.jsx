import AlertTypes, { ThresholdAlertTypes } from "./AlertTypes";
import { PREDEFINED_TIMERANGES } from "../../TimeRange/TimeRangeUtils";

export const CrudTypes = {
  add: 'ADD',
  edit: 'EDIT',
  delete: 'DELETE'
}

export const SharedColumnHeader = {
  location: "Location",
  dataType: "Data Type",
  selectedDaysOfWeek: "Days",
  createdBy: "Created By"
}

export const AirQualityAlertKeys = {
  id: "id",
  alert_type: "alert_type",
  sensor_id: "sensor_id",
  location_short: "location_short",
  datatypekey: "datatypekey",
  threshold_value: "threshold_value",
  days_of_week: "days_of_week",
  minutespastmidnight: "minutespastmidnight",
  time_range: "time_range",
  is_enabled: "is_enabled",
  excluded_dates: "excluded_dates",
  owner_role: "owner_role",
  self_is_owner: "self_is_owner",
  is_allowed_to_modify: "is_allowed_to_modify",
  message: "message",
  max_once_a_day: "max_once_a_day",
  parent_alert_id: "parent_alert_id",
  child_alert: "child_alert",
  has_child_alert: "has_child_alert"
};

export const getAlertDefaultPlaceholder = (alert_type = AlertTypes.daily.id) => {
  let localAlertType, localOppositeAlertType;
  if (alert_type === AlertTypes.threshold.id) {
    localAlertType = ThresholdAlertTypes.above_threshold.id;
    localOppositeAlertType = ThresholdAlertTypes.below_threshold.id;
  }

  return {
    [AirQualityAlertKeys.id]: '',
    [AirQualityAlertKeys.alert_type]: localAlertType || alert_type,
    [AirQualityAlertKeys.sensor_id]: '',
    [AirQualityAlertKeys.datatypekey]: '',
    [AirQualityAlertKeys.days_of_week]: [0, 1, 2, 3, 4],
    [AirQualityAlertKeys.time_range]: alert_type === AlertTypes.threshold.id ? [PREDEFINED_TIMERANGES.schoolHour.start, PREDEFINED_TIMERANGES.schoolHour.end] : null,
    [AirQualityAlertKeys.threshold_value]: -1,
    [AirQualityAlertKeys.minutespastmidnight]: '',
    [AirQualityAlertKeys.is_enabled]: true,
    [AirQualityAlertKeys.excluded_dates]: [],
    [AirQualityAlertKeys.message]: '',
    [AirQualityAlertKeys.max_once_a_day]: true,
    [AirQualityAlertKeys.parent_alert_id]: null,
    [AirQualityAlertKeys.has_child_alert]: false,
    [AirQualityAlertKeys.child_alert]: alert_type === AlertTypes.threshold.id ? {
      [AirQualityAlertKeys.alert_type]: localOppositeAlertType || alert_type,
      [AirQualityAlertKeys.threshold_value]: -1,
      [AirQualityAlertKeys.message]: '',
    } : null,
  }
}

export const addChildToAlerts = (alertList = []) => {
  const processed = [...alertList];

  processed.forEach(alert => {
    if (!alert) return;

    const isChild = !!alert[AirQualityAlertKeys.parent_alert_id];

    if (isChild) {
      const parent = processed.find(
        a => a[AirQualityAlertKeys.id] === alert[AirQualityAlertKeys.parent_alert_id]
      );

      if (parent) {
        parent[AirQualityAlertKeys.has_child_alert] = true;
        parent[AirQualityAlertKeys.child_alert] = {
          [AirQualityAlertKeys.id]: alert[AirQualityAlertKeys.id],
          [AirQualityAlertKeys.alert_type]: alert[AirQualityAlertKeys.alert_type],
          [AirQualityAlertKeys.threshold_value]: alert[AirQualityAlertKeys.threshold_value],
          [AirQualityAlertKeys.message]: alert[AirQualityAlertKeys.message],
        };
      }
    } else {
      if (alert[AirQualityAlertKeys.alert_type] === AlertTypes.daily.id) return;

      alert[AirQualityAlertKeys.has_child_alert] = false;
      alert[AirQualityAlertKeys.child_alert] = {
        [AirQualityAlertKeys.alert_type]:
          alert[AirQualityAlertKeys.alert_type] === ThresholdAlertTypes.above_threshold.id
            ? ThresholdAlertTypes.below_threshold.id
            : ThresholdAlertTypes.above_threshold.id,
        [AirQualityAlertKeys.threshold_value]: alert[AirQualityAlertKeys.threshold_value],
        [AirQualityAlertKeys.message]: ""
      };
    }
  });

  console.log(processed)

  return processed;
};