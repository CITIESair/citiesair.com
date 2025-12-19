# DateRangePicker

![date-range-picker](/documentation/date-range-picker.png)

Could be generalized more, but `DateRangePicker` is only used for chart `historical` at the moment. It allows users to query `Hourly` and `Daily` historical data for any time period with available data for each school. 

### [CustomDateRangePicker.jsx](./CustomDateRangePicker.jsx): 
  Built on `react-date-range`, this file **heavily** formats the picker so that it has the same aesthetic as the whole CITIESair.

  - Implements state management with [DateRangePickerContext.jsx](/src/ContextProviders/DateRangePickerContext.jsx) so that `CustomDateRangePicker` can be called in [SubChart.jsx](/src/Graphs/Subchart/SubChart.jsx) and implement API call to backend to request new data

  - Displays error messages and `disable` **APPLY** button for wrong user input:
    - Identical date for `startDate` and `endDate`:

      ![date-range-picker-error-1](/documentation/date-range-picker-error-1.png)

    - Date range longer than a specified amount of time for each `AggregationType` (specified in `AggregationTypeMetadata`). This is implemented because `hourly` data querying, transferring, and visualizing is computationally expensive and time consuming. This restriction improves user experience at the cost of flexibility for the user. If the user wants, they can always download the entire dataset in [DatasetDownload](/src/Components/DatasetDownload/).

      ![date-range-picker-error-2](/documentation/date-range-picker-error-2.png)

### [DateRangePickerUtils.jsx](./DateRangePickerUtils.jsx): 
  - Contains helper function to return the appropriate static ranges for each aggregation type (`hourly` or `daily`):
    - `hourly`: last 14 days, last 30 days
    - `daily`: last 30 days, all time
    - and more...
  
  With these presets, the users can quickly choose a pre-determined time period, speeding up the querying process

  - Also contain `AggregationTypeMetadata` to specify the maximum number of days that each `AggregationType` can be queried for

  - Contains helper wrapper to **heavily** formats the `react-date-range` picker with additional `CSS` because a few things are hardcoded by that library and requires overriding to achieve our desired appearance.