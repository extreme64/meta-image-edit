const {
    createElement: el,
} = wp.element;

const {
    Popover
} = wp.components;

// Define the RegisteredStyles component
export const PreviewPanel = (style) => {

    return el(
        Popover,
        {
            placement: "left-start",
            offset: 34,
            focusOnMount: false,
            onClose: () => styleItemHandler(null)
        },
        el(
            "div", 
            {
                className: "block-editor-block-styles__preview-panel",
                onMouseLeave: () => styleItemHandler(null)
            },
            el(
                'div',
                {
                    activeStyle: "activeStyle",
                    className: `preview__element is-style-${style}`
                },
            ),
            el(
                'div',
                {
                    activeStyle: "activeStyle",
                    className: "preview__info"
                },
                `${style}`
            )
        )
    )
};