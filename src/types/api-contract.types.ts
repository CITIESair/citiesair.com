import type { ClientInferResponseBody } from '@ts-rest/core';
import type {
  authContract,
  currentContract,
  dataDownloadContract,
  schoolMetadataContract,
  screenContract,
  statsContract,
} from '@citiesair/shared/contracts';

export type CurrentSensorsResponse = ClientInferResponseBody<
  typeof currentContract.getCurrentSensors,
  200
>;
export type CurrentSensorResponse = CurrentSensorsResponse[number];
export type CurrentSensorInfo = CurrentSensorResponse["sensor"];
export type SensorCoordinates = CurrentSensorInfo["coordinates"];
export type HeatIndexResult = NonNullable<
  NonNullable<CurrentSensorResponse["current"]>["heat_index_C"]
>;

export type SchoolMetadataResponse = ClientInferResponseBody<
  typeof schoolMetadataContract.getSchoolMetadata,
  200
>;

export type ScreenResponse = ClientInferResponseBody<
  typeof screenContract.getScreen,
  200
>;

export type StatsResponse = ClientInferResponseBody<
  typeof statsContract.getStats,
  200
>;

export type LoginResponse = ClientInferResponseBody<
  typeof authContract.login,
  200
>;

export type LogoutResponse = ClientInferResponseBody<
  typeof authContract.logout,
  200
>;

export type SignupResponse = ClientInferResponseBody<
  typeof authContract.signup,
  201
>;

export type VerifyResponse = ClientInferResponseBody<
  typeof authContract.verify,
  200
>;

export type GoogleCallbackResponse = ClientInferResponseBody<
  typeof authContract.googleCallback,
  200
>;

export type DatasetDownloadResponse = ClientInferResponseBody<
  typeof dataDownloadContract.downloadRawDataset,
  200
>;
