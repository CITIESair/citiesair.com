import { calculateSensorStatus, SensorStatusType } from '../../Components/AirQuality/SensorStatus';
import { TEN_YEARS_IN_MINUTES } from '../../hooks/useCurrentSensorsData';

type TimestampLike = string | Date | null | undefined;

type SensorStatusFields = {
    lastSeenInMinutes: number | null;
    sensor_status: SensorStatusType;
};

type SensorDataWithLastSeen = {
    sensor: {
        last_seen?: TimestampLike;
    };
    current?: {
        timestamp?: TimestampLike;
    } | null;
};

const getLastSeenInMinutes = (lastSeen?: TimestampLike): number | null => {
    const lastSeenTimestamp = lastSeen ? new Date(lastSeen) : null;

    const lastSeenInMinutes =
        lastSeenTimestamp && !Number.isNaN(lastSeenTimestamp.getTime())
            ? Math.round((Date.now() - lastSeenTimestamp.getTime()) / 1000 / 60)
            : null;

    return lastSeenInMinutes !== null &&
        lastSeenInMinutes <= TEN_YEARS_IN_MINUTES
        ? lastSeenInMinutes
        : null;
};

export const addSensorStatus = <T extends SensorDataWithLastSeen>(
    data: T[]
): Array<
    Omit<T, 'sensor'> & {
        sensor: T['sensor'] & SensorStatusFields;
    }
> => {
    return data.map((sensorData) => {
        const lastSeen = sensorData.sensor.last_seen ?? sensorData.current?.timestamp;
        const lastSeenInMinutes = getLastSeenInMinutes(lastSeen);

        return {
            ...sensorData,
            sensor: {
                ...sensorData.sensor,
                lastSeenInMinutes,
                sensor_status: calculateSensorStatus(lastSeenInMinutes),
            },
        };
    });
};