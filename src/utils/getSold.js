export const getSold = (year, month, summary) => {
    const yearIndex = summary.findIndex((item) => item.year === year);
    const monthIndex = summary[yearIndex].months.findIndex(
      (item) => item === month
    );
    let sold = summary[yearIndex].solds[monthIndex]
    return sold;
};