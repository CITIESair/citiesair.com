# AxesPicker

![axes-picker](/documentation/axes-picker.png)

Could be generalized more, but `AxesPicker` is only used for chart `correlationDailyAverage` at the moment. It allows users to switch between different sensors for `hAxis (horizontal)` and `vAxis (vertical)` to see linear regression correlation. 

- Includes 2 dropdown menus, one for each axis
- Ensures that selected values for each axis are different from each other (the same sensor can't be selected for both of the dropdown menus)
- State management with [AxesPickerContext.jsx](/src/ContextProviders/AxesPickerContext.jsx) so that `AxesPicker` can be called in [SubChart.jsx](/src/Graphs/Subchart/SubChart.jsx) and implement API call to backend to request new data
- If there are no changes in the selected values for either one of the two axes, `disable` **APPLY** button, and vice versa. This provides a hint to the user that the **APPLY** button must be clicked for the frontend to fetch changes from backend API.
