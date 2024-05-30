import { Link } from "react-router-dom";
import Layout from '../components/Layout';
import '../custom.css';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Button, FormControlLabel, Radio, RadioGroup, TextField, InputAdornment, Box, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";
import { saveElectionFormData } from "../services/serviceData";
import DialogForm from "../components/DialogComponent";

const PROFIT_SHARING_OPTIONS = {
    BI_WEEKLY: 'BiWeekly',
    OPT_OUT: 'OptOut',
    SPECIAL_CONTRIBUTION: 'SpecialContribution'
};

const PS401Form = () => {
    const [formData, setFormData] = useState({
        rdProfitSharingOptions: PROFIT_SHARING_OPTIONS.BI_WEEKLY,
        splProfitSharingOptions: '',
        preTaxPercentage: '',
        postTaxPercentage: '',
        preTaxAmount: '',
        postTaxAmount: '',
        chkAgreeTerms: true,
        lblParticipant: "Gokilavani Sagadevan",
        lblApplicationDate: new Date().toLocaleDateString()
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogType, setDialogType] = useState<'error' | 'success'>('error');

    const [errors, setErrors] = useState({
        preTaxPercentage: '',
        postTaxPercentage: '',
        preTaxAmount: '',
        postTaxAmount: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFieldBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setErrors({
            ...errors,
            [name]: validateField(name, value),
        });
    };

    const validateField = (name: string, value: string) => {
        let error = '';

        if (name === 'preTaxAmount' || name === 'postTaxAmount') {
            if (!/^\d*$/.test(value)) {
                error = 'Invalid value. Please enter a whole dollar amount. Please remove any special symbols like commas(,) or dollar($) or percent(%)';
            }
        } else if (name === 'preTaxPercentage' || name === 'postTaxPercentage') {
            if (!/^\d*$/.test(value)) {
                error = 'Invalid value. Please enter a whole percent. Please remove any special symbols like commas(,) or dollar($) or percent(%)';
            }
            if (parseInt(value) > 100) {
                error = 'Invalid value. Please enter a valid percent (0-100%)';
            }
        }
        return error;
    };

    const validateFields = () => {
        let valid = true;
        let newErrors = { ...errors };

        if (formData.rdProfitSharingOptions === PROFIT_SHARING_OPTIONS.SPECIAL_CONTRIBUTION) {
            if (!formData.splProfitSharingOptions) {
                setDialogMessage('Please select either "Using a whole percentage amount" or "Using a whole dollar amount"');
                setDialogType('error');
                setDialogTitle('Error');
                setOpenDialog(true);
                return false;
            }

            if (formData.splProfitSharingOptions === "Whole-Percentage") {
                newErrors.preTaxPercentage = validateField('preTaxPercentage', formData.preTaxPercentage);
                newErrors.postTaxPercentage = validateField('postTaxPercentage', formData.postTaxPercentage);

                if (!formData.preTaxPercentage && !formData.postTaxPercentage) {
                    setDialogMessage('Please enter either a Pre-Tax Percentage or a Post-Tax Percentage');
                    setDialogType('error');
                    setDialogTitle('Error');
                    setOpenDialog(true);
                    return false;
                }
            }

            if (formData.splProfitSharingOptions === "Whole-Dollar") {
                newErrors.preTaxAmount = validateField('preTaxAmount', formData.preTaxAmount);
                newErrors.postTaxAmount = validateField('postTaxAmount', formData.postTaxAmount);

                if (!formData.preTaxAmount && !formData.postTaxAmount) {
                    setDialogMessage('Please enter either a Pre-Tax Amount or a Post-Tax Amount');
                    setDialogType('error');
                    setDialogTitle('Error');
                    setOpenDialog(true);
                    return false;
                }
            }
        }

        setErrors(newErrors);
        for (let key in newErrors) {
            if (newErrors[key]) {
                valid = false;
            }
        }
        return valid;
    };

    const handleElectionFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateFields()) {
            return;
        }
        try {
            const formattedData = {
                ...formData,
                rdProfitSharingOptions: PROFIT_SHARING_OPTIONS[formData.rdProfitSharingOptions],
                splProfitSharingOptions: formData.splProfitSharingOptions
                    ? SPECIAL_CONTRIBUTION_OPTIONS[formData.splProfitSharingOptions]
                    : undefined
            };

            await saveElectionFormData(formattedData);
            setDialogMessage('Your election form has been submitted successfully!');
            setDialogType('success');
            setDialogTitle('Submitted');
            setOpenDialog(true);
        } catch (error) {
            setDialogMessage('An error occurred while submitting your form. Please try again.');
            setDialogType('error');
            setDialogTitle('Error');
            setOpenDialog(true);
        }
    };

    return (
        <>
            <Layout>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <form onSubmit={handleElectionFormSubmit}>
                            <Card>
                                <CardHeader></CardHeader>
                                <CardContent>
                                    <Typography variant="h5" sx={{ textAlign: "center", paddingBottom: 2, fontWeight: "bold", marginBottom: 2 }}>
                                        {`2025 401(k) PROFIT SHARING CONTRIBUTION ELECTION`}
                                    </Typography>
                                    <Box sx={{ p: 1, mb: 1 }} className="highlightedText">
                                        <Typography sx={{ textAlign: "left", padding: 1 }}>
                                            Profit Sharing 401(k) Contribution Election (CHOOSE ONE)
                                        </Typography>
                                    </Box>

                                    <RadioGroup
                                        sx={{ textAlign: "left", padding: 1 }}
                                        defaultValue={PROFIT_SHARING_OPTIONS.BI_WEEKLY}
                                        name="rdProfitSharingOptions"
                                        value={formData.rdProfitSharingOptions}
                                        onChange={handleChange}
                                    >
                                        <Box className="radioBox" sx={{ bgcolor: formData.rdProfitSharingOptions === PROFIT_SHARING_OPTIONS.BI_WEEKLY ? "#e6f7ff" : "transparent" }}>
                                            <FormControlLabel
                                                value={PROFIT_SHARING_OPTIONS.BI_WEEKLY}
                                                label="Use my regular bi-weekly payroll election rate for Profit Sharing"
                                                control={<Radio />}
                                            />
                                        </Box>

                                        <Box className="radioBox" sx={{ bgcolor: formData.rdProfitSharingOptions === PROFIT_SHARING_OPTIONS.OPT_OUT ? "#e6f7ff" : "transparent" }}>
                                            <FormControlLabel
                                                value={PROFIT_SHARING_OPTIONS.OPT_OUT}
                                                label="Opt-out of contributing to 401(k) from any Profit Sharing payment"
                                                control={<Radio />}
                                            />
                                        </Box>
                                        <Box className="radioBox" sx={{ bgcolor: formData.rdProfitSharingOptions === PROFIT_SHARING_OPTIONS.SPECIAL_CONTRIBUTION ? "#e6f7ff" : "transparent" }}>
                                            <FormControlLabel
                                                value={PROFIT_SHARING_OPTIONS.SPECIAL_CONTRIBUTION}
                                                label="Make a special 401(k) contribution election for Profit Sharing"
                                                control={<Radio />}
                                            />
                                        </Box>
                                    </RadioGroup>

                                    <Box sx={{ border: "2px solid #e6f7ff", borderRadius: 4, p: 1, mb: 1 }}>
                                        {formData.rdProfitSharingOptions === PROFIT_SHARING_OPTIONS.SPECIAL_CONTRIBUTION && (
                                            <>
                                                <RadioGroup sx={{ textAlign: "left", padding: 1 }} defaultValue="Bi-Weekly"
                                                    name="splProfitSharingOptions"
                                                    value={formData.splProfitSharingOptions}
                                                    onChange={handleChange}>
                                                    <FormControlLabel
                                                        value="Whole-Percentage"
                                                        label="Using a whole percentage amount"
                                                        control={<Radio />}
                                                    />

                                                    <Box sx={{ paddingLeft: 2 }}>
                                                        {formData.splProfitSharingOptions === "Whole-Percentage" && (
                                                            <>
                                                                <TextField
                                                                    label="Pre-Tax Percentage (%)"
                                                                    name="preTaxPercentage"
                                                                    value={formData.preTaxPercentage}
                                                                    onChange={handleChange}
                                                                    onBlur={handleFieldBlur}
                                                                    error={!!errors.preTaxPercentage}
                                                                    helperText={errors.preTaxPercentage}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                                    }}
                                                                    fullWidth
                                                                    margin="normal"
                                                                />
                                                                <TextField
                                                                    label="Post-Tax Percentage (%)"
                                                                    name="postTaxPercentage"
                                                                    value={formData.postTaxPercentage}
                                                                    onChange={handleChange}
                                                                    onBlur={handleFieldBlur}
                                                                    error={!!errors.postTaxPercentage}
                                                                    helperText={errors.postTaxPercentage}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                                    }}
                                                                    fullWidth
                                                                    margin="normal"
                                                                />
                                                            </>
                                                        )}
                                                    </Box>
                                                    <FormControlLabel
                                                        value="Whole-Dollar"
                                                        label="Using a whole dollar amount"
                                                        control={<Radio />}
                                                    />
                                                    <Box sx={{ paddingLeft: 2 }}>
                                                        {formData.splProfitSharingOptions === "Whole-Dollar" && (
                                                            <>
                                                                <TextField
                                                                    label="Pre-Tax Amount ($)"
                                                                    name="preTaxAmount"
                                                                    value={formData.preTaxAmount}
                                                                    onChange={handleChange}
                                                                    onBlur={handleFieldBlur}
                                                                    error={!!errors.preTaxAmount}
                                                                    helperText={errors.preTaxAmount}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                                    }}
                                                                    fullWidth
                                                                    margin="normal"
                                                                />
                                                                <TextField
                                                                    label="Post-Tax Amount ($)"
                                                                    name="postTaxAmount"
                                                                    value={formData.postTaxAmount}
                                                                    onChange={handleChange}
                                                                    onBlur={handleFieldBlur}
                                                                    error={!!errors.postTaxAmount}
                                                                    helperText={errors.postTaxAmount}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                                                    }}
                                                                    fullWidth
                                                                    margin="normal"
                                                                />
                                                            </>
                                                        )}
                                                    </Box>
                                                </RadioGroup>
                                            </>
                                        )}
                                    </Box>
                                    <FormControlLabel
                                        control={<Checkbox checked={formData.chkAgreeTerms}
                                            onChange={handleChange}
                                            name="chkAgreeTerms" />}
                                        label="I agree to the terms and conditions"
                                    />
                                    <FormHelperText></FormHelperText>
                                    <Button variant="contained" color="primary" type="submit" disabled={!formData.chkAgreeTerms}>
                                        Submit
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
            </Layout>
            <DialogForm open={openDialog} onClose={() => setOpenDialog(false)} message={dialogMessage} title={dialogTitle} type={dialogType} />
        </>
    );
};

export default PS401Form;
