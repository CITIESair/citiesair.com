import { useContext, useState } from "react";
import { DashboardContext } from "../../ContextProviders/DashboardContext";
import TimeRangeSelector from "./TimeRangeSelector";
import { PREDEFINED_TIMERANGES } from "./TimeRangeUtils";

const TimeRangeSelectorWrapperForDataHook = (props) => {
    const { defaultTimeRange, isResponsive, hasTitle, chartIndex } = props;

    const { allChartsConfigs, updateIndividualChartConfigQueryParams } = useContext(DashboardContext);
    const chartConfig = allChartsConfigs[chartIndex] || {};
    const queryParams = chartConfig.queryParams || {};
    const { startTime, endTime } = queryParams;

    const [timeRange, setTimeRange] = useState([
        startTime ?? defaultTimeRange.startTime,
        endTime ?? defaultTimeRange.endTime,
    ]);

    return (
        <TimeRangeSelector
            timeRange={timeRange}
            defaultTimeRange={defaultTimeRange}
            handleChange={(newRange) => {
                // Handle timeRange change → update DashboardContext queryParams
                setTimeRange(newRange);

                const [startTime, endTime] = newRange || [];
                if (startTime === null || endTime === null || startTime > endTime) return;

                // Change the config
                if (startTime === PREDEFINED_TIMERANGES.allday.start && endTime === PREDEFINED_TIMERANGES.allday.end) {
                    updateIndividualChartConfigQueryParams(chartIndex, {
                        startTime: null,
                        endTime: null
                    });
                } else {
                    updateIndividualChartConfigQueryParams(chartIndex, {
                        startTime,
                        endTime
                    });
                }
            }}
            isResponsive={isResponsive}
            hasTitle={hasTitle}
        />
    );
}

export default TimeRangeSelectorWrapperForDataHook;