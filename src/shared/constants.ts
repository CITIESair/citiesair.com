export interface AdminUser {
    name: string,
    email: string
};

export const CITIESair_URL: string = typeof window !== 'undefined'
    ? window.location.origin
    : '';

export const CITIESairAdmin: AdminUser = {
    name: 'Vince Nguyen',
    email: 'vince.nguyen@nyu.edu'
};

// data older than {RAW_DATA_MAX_HOURS_AGO} hours in 'raw_data' will be deleted
// this is to save space, as raw_data grows very fast as theres data every 5 mins.
export const RAW_DATA_MAX_HOURS_AGO: number = 48;

// Bin raw_data into 10 minutes. This serveres 2 purposes
// - Smooth out fluctuations for minutely data from IQAir, this is important for screen to display nicely
// - For VIEW raw_data_group_sensor to easily match between different sensors with slightly different timestamp intervals
export const MINUTE_BIN: number = 10;

export const MonthShorts: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AggregationType = {
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    month: 'month',
    year: 'year'
} as const;

export type AggregationTypeValue = typeof AggregationType[keyof typeof AggregationType];

export const AggregationTypeMetadata: Record<AggregationTypeValue, { maxDays: number; label: string }> = {
    [AggregationType.minute]: {
        maxDays: 2,
        label: 'Live'
    },
    [AggregationType.hour]: {
        maxDays: 30,
        label: 'Hourly'
    },
    [AggregationType.day]: {
        maxDays: 365,
        label: 'Daily'
    },
    [AggregationType.month]: {
        maxDays: Infinity,
        label: 'Monthly'
    },
    [AggregationType.year]: {
        maxDays: Infinity,
        label: 'Yearly'
    }
};

// used Record so that we can add more time zones dynamically in the future
export const TimeZoneOffsets: Record<string, number> = {
    'UTC': 0,
    'Asia/Dubai': 4,
    'Africa/Kampala': 3
};
