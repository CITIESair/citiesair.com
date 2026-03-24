import { DataTypeKey, DataTypeWithKey } from "./data-type.types";

export const returnFormattedDataType = ({
    dataTypeKey, dataTypes, showUnit = false
}: {
    dataTypeKey: DataTypeKey;
    dataTypes: DataTypeWithKey[];
    showUnit?: boolean;
}): string[] => {
    return dataTypes
        .filter(dataType => dataType.key === dataTypeKey)
        .map((dataType) => {
            if (showUnit) {
                const unitString = `${dataType.unit !== '' ? ` (${dataType.unit})` : ''}`;
                return `${dataType.name_short}${unitString}`;
            }
            return dataType.name_short;
        });
};
