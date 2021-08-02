import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, IconButton, Modal as MUIModal } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';

const Modal = (props) => {
    const { children, open, handleClose, backBtn, contentClassName, contentContainerStyle } = props;

    const classes = useStyles(open)();
    return (
        <MUIModal open={open} onClose={handleClose}>
            <div className={`${classes.contentContainer} ${contentClassName}`} style={contentContainerStyle}>
                {backBtn &&
                    <IconButton className={`${classes.closeBtn}`} onClick={handleClose}>
                        <CloseOutlined />
                    </IconButton>
                }
                {children}
            </div>
        </MUIModal>
    )
}

Modal.propTypes = {
    children: PropTypes.element,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    backBtn: PropTypes.bool,
    contentClassName: PropTypes.string,
    contentContainerStyle: PropTypes.object
};

const useStyles = open => makeStyles(theme => ({
    container: {
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 30,
        width: 40,
        height: 40,
        zIndex: 111,
        backgroundColor: '#fff',
        "&:hover": {
            backgroundColor: '#eaeaea'
        }
    },
    contentContainer: {
        position: 'fixed',
        top: open ? 0 : '50%',
        left: open ? 0 : '50%',
        opacity: open ? 1 : 0,
        width: open ? '100vw' : 0,
        height: open ? '100vh' : 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 110,
        transition: 'all .05s',
        overflow: 'hidden',
    },
    [theme.breakpoints.down('xs')]: {
        contentContainer: {
            width: '100vw',
            height: '100vh',
            marginTop: 0,
            borderRadius: 0,
            overflowY: 'scroll',
        },
        closeBtn: {
            right: 15,
            top: 10,
        }
    }
}));

export default Modal;
