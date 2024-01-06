const { registerBlockType, store } = wp.blocks;

import { editBlock } from './edit.js'
import { saveBlock } from './save.js'

const styles = [
    {
        name: 'default',
        label: 'Default',
        isDefault: true
    },
    {
        name: 'mietest1',
        label: 'MIE Test 1',
    }
]

wp.domReady( function() {
    console.log("domReady");
    wp.blocks.registerBlockStyle('mie/image', [
        {
            name: 'mietest1',
            label: 'The mietest1',
        }
    ]);
} );

registerBlockType("mie/image", {
    
    title: 'MIE Image',
    icon: 'format-image',
    category: 'common',
    supports: {
        align: ['wide', 'full'],
    },
    

    edit: (props) => {
        return editBlock(props, styles);
    },
    save() {
        return saveBlock();
    }

});