import {createStyled} from "@stitches/react";

export const { css, styled } = createStyled({
    tokens: {
        colors: {
            $darkGrey: '#0c0c0c',
            $darkGreyLighter: '#161617',
            $white: 'white',
            $lightPurple: '#9494b7',
            $faint: '#22222b',
            $purple: '#3e3ca2',
            $faintPurple: '#56566f',
            $midPurple: '#636380',
            $darkPurple: '#212052',
            $pink: '#d72859',
        },
        sizes: {
            $sidebar: '220px',
            $sidebarPlus: '260px',
            $headerHeight: '42px',
        },
        space: {
            $0b: '2px',
            $1: '4px',
            $1b: '6px',
            $2: '8px',
            $2b: '12px',
            $3: '16px',
        },
        fonts: {
            $main: 'Roboto, sans-serif',
        },
        fontSizes: {
          $1: '10px',
          $1b: '12px',
          $2: '14px',
          $3: '18px',
          $4: '22px',
        },
        fontWeights: {
            $regular: '400',
            $semi: '500',
            $medium: '600',
            $bold: '700',
        },
        radii: {
            $1: '3px',
            $2: '6px',
        },
        zIndices: {
            $high: '9999999',
            $max: '99999999999',
        }
    }
});

css.global({
    [`*, *:before, *:after`]: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        maxWidth: '100%',
    }
})