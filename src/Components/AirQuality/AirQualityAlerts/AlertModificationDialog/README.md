# AlertModificationDialog

This folder contains components for rendering the CRUD modification dialog for each air quality alert.

### Main Files

- [**AlertModificationDialog.jsx**](./AlertModificationDialog.jsx): 

  ![alert-modification-dialog](/documentation/alert-dialog.png)
  ---

  Support 3 different types of CRUD operations from the user, enumerated in `CrudTypes` in Alert's [Utils.jsx](../Utils.jsx):
    - `ADD`: opens an alert dialog with no data for the user to input new data and create a new alert. The type of alert (`threshold` or `daily`) depends on which `AlertTabs` the user is on, read more [here](./README.md). `SAVE ALERT` button is `disabled` until all properties are filled correctly. Upon `SAVE ALERT`, it makes a `POST` request to the server to add this new alert to the DB.

      ![alert-ADD-dialog](/documentation/alert-ADD.png)
      ---

    - `EDIT`: opens an alert dialog of the selected alert for EDITING (pencil icon). The input fields are pre-populated with data from the server for that alert, and the user can freely change these input fields:
      - Sensor location
      - Data type
      - Threshold types and threshold values (for `threshold`) or Alert Hour (for `daily`)

      `SAVE EDIT` button is `disabled` until there are any local changes to the properties of the alerts, compared to data received from backend. Upon `SAVE EDIT`, it makes a `PUT` request to the server to edit this specific alert in the DB.

      ![alert-EDIT-dialog](/documentation/alert-EDIT.png)
      ---

    - `DELETE`: similar to `EDIT`, it opens an alert dialog of the selected alert for DELETING (trash icon). The input fields are pre-populated with data from the server for that alert but they are all `disabled` to prevent the user from making any changes. This only serves to confirm the user that they are deleting the correct alert. Upon `DELETE`, it makes a `DELETE` request to the server to remove this new alert from the DB.

      ![alert-DELETE-dialog](/documentation/alert-DELETE.png)
      ---

- [**SimplePicker.jsx**](./AlertPropertyComponents/SimplePicker.jsx): 

  ![alert-simple-picker](/documentation/alert-simple-picker.png)
  
  Built upon MUI's `Select`, this component renders a simple dropwdown menu picker for selecting properties for alert, such as:
  - Sensor location
  - Data type
  - Alert Hour

- [**ThresholdTypeToggle.jsx**](./AlertPropertyComponents//ThresholdTypeToggle.jsx): 

  ![alert-threshold-type-toggle](/documentation/alert-threshold-type-toggle.png)
  
  Built upon MUI's `ToggleButton`, this component renders a toggle button group for selecting between `> above` and `< below` a selected threshold values for the `threshold` alert type. It refers to enumeration data from [AlertTypes.jsx](src/Components/AirQuality/AirQualityAlerts/AlertTypes.jsx) to display the appropriately formatted labels.

- [**ThresholdSlider.jsx**](./AlertPropertyComponents//ThresholdSlider.jsx): 

  Arguably one of the most complicated UI component in CITIESair, this component **heavily** builds upon MUI's `Slider` to make a threshold value sliding selector for the `threshold` alert. Some notable features:

    - Uses a range slider (`[slider_value_1, slider_value_2]`)instead of a single-value slider (`slider_value`). While this might seem counterintuitive given that there is only one threshold value for each alert, this helps us achieve this ~~crossed-out~~ effect when switching between `below_threshold` and `below_threshold` type. This is necessary to indicate to the user which range of value of a certain data type they will receive alert:

      - `above_threshold`: the **BOTTOM** part of the slider is ~~crossed-out~~, indicating that the alert will only be sent if the measurement **ABOVE** the selected threshold
        ![alert-threshold-slider-above](/documentation/alert-threshold-slider-above.png)
        
      - `below_threshold`: the **TOP** part of the slider is ~~crossed-out~~, indicating that the alert will only be sent if the measurement **BELOW** the selected threshold
        ![alert-threshold-slider-below](/documentation/alert-threshold-slider-below.png)

      Without going too deep in the technical implementation of this quirk, just know that the real `threshold_value` might be the `slider_value_1` or `slider_value_2` in the range slider's array `float[2]`, depends on whether the `threshold_type` is `above` or `below`. For example:

        - `above_threshold`: [`threshold_value`, `MAX_of_the_slider`] -> [`MIN_of_the_slider`, `threshold_value`] will be ~~crossed-out~~ (unselected)
        
        - `below_threshold`: [`MIN_of_the_slider`, `threshold_value`] -> [`threshold_value`, `MAX_of_the_slider`] will be ~~crossed-out~~ (unselected)

    - "Snap-to-grid" feature:
      - For `dataType` with categorization (AQI, PM2.5, PM10, VOC, CO2), the slider offers a neat feature to snap into the boundary of the categories when moving it around, making it easier and more precise for user to set up an alert of this nature:

        ```
        Send alert for outdoors sensor if AQI is exceeds Unhealthy mark
        ```

        This is done by providing MUI's `Slider` a custom array `marks`.

      - For `dataType` with no categorization (temperature, humidity, pressure), the slider is continuous. Users can slide to whatever value they want with an increment of `stepsForThreshold`, specified in the `dataType`'s `colorAxis`. Refer to:
        - [CustomThemes.jsx](/src/Themes/CustomThemes.jsx): continuous data
        - [AirQualityIndexHelper.jsx](/src/Utils/AirQuality/AirQualityIndexHelper.jsx): `getCategoryColors`: data with categorization

    - An accompanying `TextField` for the user to input manual value if they wish to have even higher degree of precision. This value is linked to the `threshold_value` on the `Slider`, so a change in one will propagate to a change in another. Also serves as a numerical representation of the selected `threshold_value` on the `Slider`. 

### Mics Files

- [**DialogData.jsx**](./DialogData.jsx):

  Contains enumerations for textual data that are different for each CRUD dialog `ADD`, `EDIT`, `DELETE`, such as the name of the `primaryButtonLabel` or the `successMessage`.

- [**HOURS.jsx**](./AlertPropertyComponents/HOURS.jsx):

  Returns an array of formatted object for [SimplePicker.jsx](./SimplePicker.jsx). It spans from `01:00` to `23:00` for `daily` alert's Alert Hour. `00:00` is not included to prevent any unforeseen bug from the backend.

