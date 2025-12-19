# TimeRangeSelector

Used to constrain **intra-day (hour)** queries for charts (to filter data to only school hours for example) and alerts (to define the time of the day when a threhsold alert can be sent)

![dashboard-page-1](/documentation/dashboard-page-1.png)
*The time range selector as seen in the historical dashboard chart*

### [TimeRangeSelector.jsx](./TimeRangeSelector.jsx):
Provides a compact UI for selecting a **start hour** and **end hour**. Supports two selection modes:
- **Predefined ranges**:
    - `All Day` (0–23h)
    - `School Hour` (7–17h)
- **Custom**:
    - Manually select `From` and `To` hours
- Disables invalid selections (e.g. end time earlier than start time)
- Responsive layout: Horizontal / vertical toggle buttons depending on screen size

### [TimeRangeSelectorWrapperForDataHook.jsx](./TimeRangeSelectorWrapperForDataHook.jsx):
A thin wrapper that connects `TimeRangeSelector` to `DashboardContext`.

- Syncs selected time range with chart-level `queryParams`
- Updates `startTime` / `endTime` for the corresponding chart
- Treats `All Day` as the default state (`startTime = null`, `endTime = null`)
- Ensures only valid time ranges trigger data re-fetching

### [TimeRangeUtils.jsx](./TimeRangeUtils.jsx):
Utility helpers and configuration for time range selection.

- `HOURS`:
  - Generates selectable hourly values (`00:00` → `23:00`)
- `PREDEFINED_TIMERANGES`:
  - Defines static presets such as `All Day`, `School Hour`, and `Custom`
- Helper functions to normalize and format time values