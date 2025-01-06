# AirQualityAlerts

This folder contains components for rendering and allowing CRUD operations for air quality alerts. As of July 2024, air quality alerts are made available to all logged-in schools but not `nyuad`. Supports for `nyuad` must take into account these problems:
- Authentication for adding new email / alert (magic link email)
- Rate limiting for sending email with Amazon SES. It is estimated that there will be around 500 people signing up for `nyuad` alerts
- Any other optimization

### Main Files

In the order of nested DOMs:

- [**AirQualityAlert.jsx**](./AirQualityAlert.jsx): 

  Just a wrapper that uses [CustomDialog](src/Components/CustomDialog/CustomDialog.jsx) to display a new dialog for the air quality alert section's contents:
  - `AlertsTabs`
  - `EmailsInput`

- [**AlertsTabs.jsx**](./AlertsTabs.jsx): 

  This component splits all the alerts belonging to each school to 2 categories:
  - `threshold`: an email alert is sent when the selected `dataType` for the selected `sensor` `exceeds/drops below` a selected `threshold` (hourly data)
  - `daily`: an email alert is sent daily at the selected `hour` for the selected `dataType` for the selected `sensor` (hourly data)

- [**AlertsTable.jsx**](./AlertsTable.jsx): 

  This component displays the list of alerts belonging to an `alertType`:

  ```
  <AlertsTable
    alertTypeKey={alertTypeKey}
    alertsForTable={alertsArray}
  />
  ```

  ![alerts-tabs-and-alerts-table](/documentation/alerts-tabs-and-alerts-table.png)

  It displays a summary of all data related to each alert:
    - Sensor Location (based on the name of the sensor)
    - Data Type (AQI, PM2.5, temperature...)
    - Threshold (exceeds/drops below a certain threshold for `threshold`) or Alert Hour (for `daily`)

  It also displays buttons to interact with each alert:
    - `EDIT` (pencil icon to the far right of each alert row)
    - `DELETE` (trash icon to the far right of each alert row)
    - `ADD` (add alert button at the bottom of the table)

- [**AlertModificationDialog**](./AlertModificationDialog/): 

  This folder contains components for rendering the CRUD modification dialog for each air quality alert.
  
  Read its documentation [here](.//AlertModificationDialog/README.md)

### Mics Files

- [**EmailsInput.jsx**](./EmailsInput.jsx): 

  ![emails-input-for-alert](/documentation/emails-input-for-alert.png)
  
  This component renders an input field for email addresses that admins can add for their schools. It mimics how adding email addresses works in GMail:

  - An input field with email `Chips`
  - The user can type email addresses in and finalize each address by typing `Enter` or `spacebar` 
  - Each email `Chip` has a `x` button to remove that email
  - Clicking anywhere on an email `Chip` opens a dropdown menu that currently only has the option to `Edit` that email address. When an email addressed is being edited this way, it will be moved to the end of the input field
  - There are several checks in place for invalid user inputs:
    - Wrong email format (must be abc@def.xyz):
      
      ![emails-input-invalid-email-format](/documentation/emails-input-invalid-email-format.png)

    - Duplicate email address:

      ![emails-input-duplicate-email](/documentation/emails-input-duplicate-email.png)

  - Upon entering all the desired emails, the user must click `SAVE EMAIL LIST` to propagate all local changes to the server/DB. This button is `disabled` if there is no local changes to the received email list from the server.

- [**AlertTypes.jsx**](./AlertTypes.jsx): 

  Contains enumerations for different types of alerts. In general, there are only 2 types `threshold` and `daily`. However, for threshold, there are 2 sub-types: `below_threshold` and `above_threshold` since backend categorizes them as different.

