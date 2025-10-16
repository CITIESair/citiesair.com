import { HOURS } from "./HOURS";

export const PREDEFINED_TIMERANGES = {
    allday: { id: "allday", label: "All Day", from: HOURS[0].value, to: HOURS[HOURS.length - 1].value, fromToLabel: "0-23h" },
    schoolHour: { id: "schoolHour", label: "School Hour", from: HOURS[7].value, to: HOURS[17].value, fromToLabel: "7-17h" },
    custom: { id: "custom", label: "Custom" }
};
