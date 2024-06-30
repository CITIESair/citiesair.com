import { CrudTypes } from '../Utils';

export const DialogData = {
  [CrudTypes.add]: {
    title: "Add A New Alert",
    primaryButtonLabel: "Save Alert",
    errorMessage: "Server error: new alert was not saved. Please try again"
  },
  [CrudTypes.edit]: {
    title: "Edit Alert",
    primaryButtonLabel: "Save Edit",
    errorMessage: "Server error: changes were not saved. Please try again"
  },
  [CrudTypes.delete]: {
    title: "Delete Alert",
    contentText: "Are you sure you want to delete this alert?",
    primaryButtonLabel: "Delete",
    errorMessage: "Server error: alert not deleted. Please try again."
  }
};
