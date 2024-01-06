/*
 * RegisteredStyles Component
 *
 * This component renders a list of style buttons and handles style selection events.
 *
 * Methods:
 * 1. useEffect: Runs an effect after the component is mounted to hide the registered styles wrap.
 * 2. onStyleSelect: Handles the style selection event and updates the active style.
 * 3. onSelectStylePreview: Handles the style preview selection event.
 * 4. getActiveStyle: Retrieves the active style based on the class tokens.
 * 5. getDefaultStyle: Retrieves the default style.
 * 6. replaceActiveStyle: Replaces the active style with the new style.
 * 7. createButton: Creates a button element.
 * 8. styleButtons: Creates style buttons based on the provided styles.
 *
 * Additional Functions:
 * 1. hideRegisteredStylesWrap: Hides the registered styles wrap by modifying the display property.
 *
 * Dependencies:
 * - wp.components: Button
 * - wp.element: createElement, useEffect, useState
 * - wp.data: withDispatch
 */

const {
    Button,
} = wp.components;
const TokenList = wp.TokenList;
const {
    createElement: el,
    useEffect,
    useState
} = wp.element;

const {
    Popover
} = wp.components;

const { withDispatch } = wp.data;

// Define the RegisteredStyles component
const RegisteredStyles = ({ styles, ...props }) => {
    const { attributes, setAttributes, createNotice } = props;

    const [showPreview, setShowPreview] = useState(false);
    const [currentStyle, setCurrentStyle] = useState(false);
    const [hoveredStyle, setHoveredStyle] = useState(false);

    // Run the effect only once after the component is mounted
    useEffect(() => {
        const reqSylWrap = document.querySelector('.block-editor-block-inspector .block-editor-block-styles');
        hideRegisteredStylesWrap(reqSylWrap);
    }, []);

    // Handle the style selection event
    const onStyleSelect = (newStyle) => {
        let figure = document.querySelector('[data-type="mie/image"] > *');
        let classTokens = figure.classList;
        let activeStyle = getActiveStyle(styles, classTokens);

        if (figure) {
            replaceActiveStyle(classTokens, activeStyle, newStyle);
            setAttributes({
                className: 'is-style-' + newStyle.name
            });
        }
        setCurrentStyle(activeStyle);
        createNotice({ content: `Style selected!: aaa`, type: 'success' });
    };

    // Handle the style preview selection event
    const onSelectStylePreview = (style) => {
        onStyleSelect(style);
    };

    const styleItemHandler = (item) => {
        console.log('styleItemHandler', item);
        setHoveredStyle(item)
        setShowPreview(item)
    };


    function getActiveStyle(styles, tokenList) {
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
    function getDefaultStyle(styles) {
        return styles?.find((style) => style.isDefault);
    }

    // Replace the active style with the new style
    function replaceActiveStyle(list, activeStyle, newStyle) {
        if (activeStyle) {
            list.remove('is-style-' + activeStyle.name);
        }

        list.add('is-style-' + newStyle.name);
        return list.value;
    }

    // Create a button element
    const createButton = (style, className, variant = "secondary") => {
        return el(Button, {
            className: className,
            key: style.name,
            variant: variant,
            label: style.label,
            'aria-current': false,
            name: style.label,
            onMouseEnter: () => styleItemHandler(style),
            onMouseLeave: () => styleItemHandler(null),
            onClick: () => onSelectStylePreview(style)
        },
            style.label
        );
    };

    // Create style buttons
    const styleButtons = (styles) => {
        if (!Array.isArray(styles)) {
            return null;
        }

        return styles.map((style) => {
            return createButton(style, "block-editor-block-styles__ite");
        });
    };

    const previewModal = () => {
        let styleToShow;

        if (!hoveredStyle){
            styleToShow = currentStyle.name
        } else {
            styleToShow = hoveredStyle.name
        }

        return showPreview && el(
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
                    onMouseLeave:  () => styleItemHandler(null)
                },
                el(
                    'div', 
                    {
                        activeStyle: "activeStyle",
                        className: `preview__element is-style-${styleToShow}`

                    }, 
                ),
                el(
                    'div',
                    {
                        activeStyle: "activeStyle",
                        className: "preview__info"

                    },
                    `${styleToShow}`
                )
            )
    )};


    return el('div', null, [
        styleButtons(styles),
        previewModal()
    ]);
};

// Hide the registered styles wrap
const hideRegisteredStylesWrap = (target) => {
    let stylesSegmentWrap;

    // Traverse up the DOM, find the super parent element
    let superParentRef = target;
    while (superParentRef.parentNode) {
        superParentRef = superParentRef.parentNode;
        if (superParentRef.classList.contains('components-panel__body')) {
            stylesSegmentWrap = superParentRef;
            break;
        }
    }

    stylesSegmentWrap.style.display = 'none';
};

// Apply withDispatch to provide the createNotice function
const applyWithDispatch = withDispatch((dispatch) => {
    const { createSuccessNotice } = dispatch('core/notices');

    return {
        createNotice: (content) => createSuccessNotice(content),
    };
});

// Apply withDispatch to the RegisteredStyles component
const EnhancedRegisteredStyles = applyWithDispatch(RegisteredStyles);

export { RegisteredStyles, hideRegisteredStylesWrap, EnhancedRegisteredStyles };