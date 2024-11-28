import { Box, Typography, Button, Divider, Grid, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLoader } from '../../Reducers/LoaderProvider';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSubscription } from '../../API/subscription';
const SubscriptionInfo = () => {
    const user = useSelector((state) => state.Auth);
    const [data, setData] = useState({})
    const { setLoading } = useLoader();
    const dispatch = useDispatch()
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            fetchData();

        }, 1000); // 1 second delay
    }, []);
    useEffect(() => {
        console.log("data", data)
    }, [data])
    const fetchData = async () => {
        await dispatch(getSubscription(user, setData))
    };
    const isPayNowActive = data.daysLeft <= 6;
    return (
        <Box sx={{
            width: "100%"
        }}>
            <Box
                sx={{
                    margin: { xs: '0px', sm: '30px', md: '30px' },
                    backgroundColor: "white",
                    width: "95%",
                    borderRadius: "10px",
                }}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Subscription Overview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2} sx={{ px: 5 }}>
                        <Grid item xs={6}>
                            <Typography variant="body2">Status</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Chip
                                label={data && data?.status}
                                sx={{
                                    backgroundColor: data?.status === 'Active' ? '#2FCA44' : '#DF2C14',
                                    color: 'white', // Optional, to ensure the text is white
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Days Left</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{data?.daysLeft
                                ? data.daysLeft // for dd-mm-yyyy
                                : ''} Days</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Current Plan</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">Premium - ₹300/month</Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Current Billing Info */}
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Current Billing Info
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2} sx={{ px: 5 }}>
                        <Grid item xs={6}>
                            <Typography variant="body2">Subscription Start</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                                {data?.subscriptionStart
                                    ? new Date(data.subscriptionStart).toLocaleDateString("en-GB") // for dd-mm-yyyy
                                    : ''}
                            </Typography>

                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Last Payment</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{data?.lastPayment
                                ? new Date(data.lastPayment).toLocaleDateString("en-GB") // for dd-mm-yyyy
                                : ''}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Upcoming Billing Info */}
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Upcoming Billing Info
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2} sx={{ px: 5 }}>
                        <Grid item xs={6}>
                            <Typography variant="body2">Next Due Date</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{data?.nextDueDate
                                ? new Date(data.nextDueDate).toLocaleDateString("en-GB") // for dd-mm-yyyy
                                : ''}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2">Next Billing Date</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="error">{data?.nextBillingDate
                                ? new Date(data.nextBillingDate).toLocaleDateString("en-GB") // for dd-mm-yyyy
                                : ''}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                {/* Buttons */}

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3, mx: 5, gap: 5, mb: 5 }}>
                <Button variant="outlined" color="primary">
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={!isPayNowActive}
                    sx={{
                        cursor: isPayNowActive ? 'pointer' : 'not-allowed',
                    }}
                >
                    Pay Now
                </Button>
            </Box>

        </Box>
    );
};

export default SubscriptionInfo;
