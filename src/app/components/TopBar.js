import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from './Avatar';
import { Logo, Modal } from '.';
import axios from '../config/axios';
import { Paper, Button, Hidden, Typography, makeStyles, IconButton, TextField, CircularProgress } from '@material-ui/core';
import { MenuOutlined, Search, CloseOutlined } from '@material-ui/icons';

import { getAdmin } from '../redux/slices/admin';
export default function TopBar({ openSideBar }) {
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const [serachResults, setSearchResults] = useState([]);
    const [searchHeight, setSearchHeight] = useState(70);
    const admin = useSelector(getAdmin);

    let title;
    if (window.location.href.indexOf("nouvelles_categories") !== -1) {
        title = "Création catégory";
    } else if (window.location.href.indexOf("nouvelles_places") !== -1) {
        title = "Création places";
    } else if (window.location.href.indexOf("nouvelles_photos") !== -1) {
        title = "Création photos";
    } else {
        title = "Tableau de bord";
    }

    const onClose = () => {
        setOpenSearch(false);
    };

    const onSearch = () => {
        setOpenSearch(true);
    };

    const handleSearchInput = (e) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        if (query !== "") {
            setLoading(true);
            axios
                .get(`/place/search/${query}`)
                .then(res => {
                    if (res.data.code) {
                        console.log(res.data);
                    } else {
                        if (res.data instanceof Array) {
                            if (res.data.length > 0) {
                                setSearchHeight(490);
                            }
                        }
                        setSearchResults(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [query]);

    const classes = useStyles();
    return (
        <Paper className="top_bar">
            <Button
                size="medium"
                disableElevation
                onClick={openSideBar}
                className="menu-btn"
                style={{
                    padding: 0,
                    minWidth: 35,
                    height: 35,
                }}
            >
                <MenuOutlined />
            </Button>
            <div className="logo-container">
                <Logo size={30} />
                <Hidden xsDown>
                    <Typography variant="h6" color="primary" className="title">KibeneteAdmin</Typography>
                </Hidden>
            </div>
            <Typography variant="h6" className="content-title">{title}</Typography>
            <div className="user">
                <Button color="default" variant="outlined" className="search-btn" onClick={onSearch}>
                    <Hidden smDown>
                        <Typography variant="caption" style={{ textTransform: 'initial', color: "inherit", marginRight: 10 }}>Recherche</Typography>
                    </Hidden>
                    <Search color="inherit" />
                </Button>
                <Hidden only="xs">
                    {admin && <h5>{admin.username}</h5>}
                </Hidden>
                <Avatar user={admin} />
                {openSearch &&
                    <Modal open={openSearch} handleClose={onClose} contentClassName={classes.modalContent}>
                        <div className={classes.searchContainer}>
                            <Typography variant="h6" style={{ padding: '10px 0 0 10px' }}>Recherche</Typography>
                            <IconButton size="small" className={classes.closeBtn} onClick={onClose}>
                                <CloseOutlined />
                            </IconButton>
                            <div className={classes.searchInput}>
                                <TextField
                                    value={query}
                                    onChange={handleSearchInput}
                                    variant="outlined"
                                    placeholder="Votre text ici..."
                                    fullWidth
                                    inputProps={{
                                        style: {
                                            padding: "20px!important",
                                            fontSize: 23,
                                            backgroundColor: '#fff'
                                        }
                                    }}
                                />
                            </div>
                            <div className={classes.searchResults}>
                                {loading && <div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={13} /></div>}
                                <div className={classes.resultContainer} style={{ display: 'flex', flexDirection: 'column', padding: '0 10px', overflowY: 'auto', height: searchHeight }}>
                                    {serachResults.length === 0 ?
                                        <div style={{ alignSelf: 'center', justifySelf: 'center' }}>
                                            <Typography style={{ textAlign: 'center', color: "#555" }} variant="body2">Aucun résultat</Typography>
                                        </div> :
                                        <div>
                                            <Typography variant="body1" color="primary" style={{ margin: '10px 0' }}>Résultats</Typography>
                                            {serachResults.map((res, index) => (
                                                <Link to={`/admin/places/${res._id}`} key={`${res._id}_${index}`} onClick={onClose} className={classes.result}>
                                                    <Typography style={{ color: 'inherit', fontWeight: "inherit" }}>{res.name}</Typography>
                                                </Link>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        </Paper>
    )
}

const useStyles = makeStyles(theme => ({
    header: {
        borderBottom: '1px solid #eaeaea',
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    searchContainer: {
        backgroundColor: '#f6f6f6',
        width: 'calc(100vw / 2)',
        minWidth: 400,
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
            height: '100vh',
            minWidth: '100%',
            borderRadius: 0,
        }
    },
    searchInput: {
        width: '100%',
        margin: '15px 0',
        padding: '0 10px'
    },
    closeBtn: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    resultContainer: {
        [theme.breakpoints.down('xs')]: {
            height: '100%',
        }
    },
    result: {
        display: 'block',
        backgroundColor: '#fff',
        padding: "12px 10px",
        borderRadius: 5,
        boxShadow: '0px 1px 2px 0px #cac6c65e',
        fontWeight: '700',
        color: '#000000ab',
        marginBottom: 7,
        transition: 'background .1s',
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
    },
    modalContent: {
        alignItems: 'flex-start!important',
        paddingTop: 30,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
        }
    }
}));
