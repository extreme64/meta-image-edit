export function getActiveStyle(styles, tokenList) {
    for (const style of tokenList) {
        if (style.indexOf('is-style-') === -1) {
            continue;
        }

        const potentialStyleName = style.substring(9);
        const activeStyle = styles?.find(
            ({ name }) => name === potentialStyleName
        );

        if (activeStyle) {
            return activeStyle;
        }
    }

    return getDefaultStyle(styles);
}

// Retrieve the default style
export function getDefaultStyle(styles) {
    return styles?.find((style) => style.isDefault);
}

// Replace the active style with the new style
export function replaceActiveStyle(list, activeStyle, newStyle) {
    if (activeStyle) {
        list.remove('is-style-' + activeStyle.name);
    }

    list.add('is-style-' + newStyle.name);
    return list.value;
}