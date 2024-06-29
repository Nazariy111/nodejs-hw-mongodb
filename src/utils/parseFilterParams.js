const parseBoolean = (value) => {
    if(typeof value !== "string") return;

    if (!["true", "false"].includes(value)) return;

    return value;
};

const parseFilterParams = ({ isFavourite }) => {
    const parsedIsFavourite = parseBoolean(isFavourite);

    return {
        isFavourite: parsedIsFavourite,
    };
};

export default parseFilterParams;
