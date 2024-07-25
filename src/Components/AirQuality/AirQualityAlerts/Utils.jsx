export const returnHoursFromMinutesPastMidnight = (minutes) => {
  const hoursPastMidnight = Math.floor(minutes / 60);
  return hoursPastMidnight.toString().padStart(2, '0') + ':00';
}

export const CrudTypes = {
  add: 'ADD',
  edit: 'EDIT',
  delete: 'DELETE'
}

export const SharedColumnHeader = {
  location: "Sensor Location",
  dataType: "Data Type"
}