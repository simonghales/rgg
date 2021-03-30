import {styled} from "./stitches.config";
import {StyledButton} from "./generics";

export const StyledTextButton = styled(StyledButton, {
    cursor: 'pointer',
    color: '$midPurple',
    '&:hover': {
        color: '$lightPurple',
        textDecoration: 'underline',
    }
})

export const StyledPlainButton = styled(StyledButton, {
    fontSize: '$1b',
    fontWeight: '$medium',
    border: '2px solid $purple',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '9999999px',
    padding: '$2',
    transition: '200ms ease all',
    '&:not(:disabled)': {
        cursor: 'pointer',
    },
    '&:hover:not(:disabled)': {
        borderColor: '$purple',
        backgroundColor: '$purple',
        color: '$white',
    },
    '&:disabled': {
        borderColor: 'transparent',
        opacity: 0.6,
    },
    variants: {
        appearance: {
            faint: {
                borderColor: '$darkPurple',
            }
        },
        shape: {
            tiny: {
                padding: '0 $1b',
                fontSize: '$1',
            },
            full: {
                width: '100%',
            },
            thinner: {
                padding: '0 $2b',
                height: '25px',
            },
            thinnerWide: {
                padding: '0 $2b',
                height: '25px',
                width: '100%',
            },
            round: {
                padding: '0',
                width: '25px',
                height: '25px',
            }
        }
    }
})

export const StyledRoundButton = styled(StyledPlainButton, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    padding: 0,
})
