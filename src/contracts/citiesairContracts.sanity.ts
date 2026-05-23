import type { ClientInferResponseBody } from '@ts-rest/core';
import {
    currentContract,
    schoolMetadataContract,
    screenContract,
} from '@citiesair/shared/contracts';

export type CurrentSensorsContractResponse = ClientInferResponseBody<
    typeof currentContract.getCurrentSensors,
    200
>;

export type SchoolMetadataContractResponse = ClientInferResponseBody<
    typeof schoolMetadataContract.getSchoolMetadata,
    200
>;

export type ScreenContractResponse = ClientInferResponseBody<
    typeof screenContract.getScreen,
    200
>;

export const citiesairContractSanity = {
    current: {
        allSensors: currentContract.getCurrentSensors.path,
        sensorByLocation: currentContract.getCurrentSensorByLocation.path,
    },
    schoolMetadata: {
        metadata: schoolMetadataContract.getSchoolMetadata.path,
    },
    screen: {
        screenData: screenContract.getScreen.path,
    },
} as const;
