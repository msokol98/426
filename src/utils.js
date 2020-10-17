export const getColor = number => {
    const colors = {
        2: "#4A6075",
        4: "#6C78EF",
        8: "#20347D",
        16: "#79779A",
        32: "#55537E",
        64: "#9370DB",
        128: "#BFA36D",
        256: "#7665C2",
        512: "#B4976D",
        1024: "#91744B",
        2048: "#DDC5A2"
    }

    return colors[number];
}

export const getFontSize = number => {
    if(number < 100)
        return "auto";
    
    if(number < 1000)
        return "3rem";

    return "2.7rem";
}