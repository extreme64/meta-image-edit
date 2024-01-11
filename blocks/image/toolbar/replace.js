
const {
    createElement: el,
    useEffect,
    useState,
    useReducer
} = wp.element;

const { Popover } = wp.components;
const { MediaUpload } = wp.blockEditor
// const { dispatch, withDispatch } = wp.data;


const ReplacePanel = ({ ...props }, dispatch) => {

    const { attributes, setAttributes } = props;


    const onSelectMedia = (media) => {

        setAttributes({
            mediaURL: media.url,
            mediaID: media.id,
        });
    };


    return el(
        Popover,
        {
            onClick: () => {
            },
            placement: "left-start",
            offset: 34,
            focusOnMount: false,
            className: "components-popover components-dropdown__content block-editor-media-replace-flow__options is-positioned is-alternate"
        },
        el(
            "div",
            {
                role: "menu",
                'aria-orientation': "vertical",
                className: "block-editor-media-replace-flow__media-upload-menu",
            },
            el(MediaUpload, {
                onClose: () => {
                    // dispatch({ type: 'CLOSE_MODAL' });
                },
                onSelect: onSelectMedia,
                allowedTypes: ['image'],
                value: attributes.mediaID,
                render: function (propas) {
                    return el('button',
                        {
                            onClick: propas.open
                        },
                        "Open Media Library",
                        el("svg",
                            {
                                xmlns: "http://www.w3.org/2000/svg",
                                viewBox: "0 0 24 24",
                                width: "24",
                                height: "24",
                                "aria-hidden": "true",
                                focusable: "false",
                                className: "components-menu-items__item-icon has-icon-right"
                            },
                            el("path", {
                                d: "M18.7 3H5.3C4 3 3 4 3 5.3v13.4C3 20 4 21 5.3 21h13.4c1.3 0 2.3-1 2.3-2.3V5.3C21 4 20 3 18.7 3zm.8 15.7c0 .4-.4.8-.8.8H5.3c-.4 0-.8-.4-.8-.8V5.3c0-.4.4-.8.8-.8h13.4c.4 0 .8.4.8.8v13.4zM10 15l5-3-5-3v6z"
                            })
                        )
                    )
                }
            })
        )
    )
};

export { ReplacePanel }