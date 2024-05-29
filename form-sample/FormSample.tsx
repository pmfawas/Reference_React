import React, { useState } from 'react';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
    TextField,
    Button,
    Box,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const MyForm: React.FC = () => {
    const [formData, setFormData] = useState({
        radioOption: '',
        agreeTerms: false,
        participant: 'John Doe', // Set initial participant value
        applicationDate: new Date(),
        contributionAmount: '',
        contributionPercentage: '',
        specialContribution: false,
    });

    const [errors, setErrors] = useState({
        contributionAmount: '',
        contributionPercentage: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleDateChange = (date: Date) => {
        setFormData({
            ...formData,
            applicationDate: date,
        });
    };

    const validateField = (name: string, value: string) => {
        let error = '';
        if (!/^\d*$/.test(value)) {
            error = 'Must be a number';
        } else if (!value) {
            error = 'Required';
        }
        return error;
    };

    const handleFieldBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setErrors({
            ...errors,
            [name]: validateField(name, value),
        });
    };


    const validateFields = () => {
        let valid = true;
        let newErrors = { ...errors };

        if (formData.radioOption === 'special') {
            newErrors.contributionAmount = validateField('contributionAmount', formData.contributionAmount);
            newErrors.contributionPercentage = validateField('contributionPercentage', formData.contributionPercentage);
            valid = !newErrors.contributionAmount && !newErrors.contributionPercentage;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateFields()) {
            return;
        }

        // Make an API call to save the data
        try {
            const response = await axios.post('/api/saveData', formData);
            console.log('Data saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const radioOptions = [
        { value: 'regular', label: 'Use my regular' },
        { value: 'optOut', label: 'Opt-out' },
        { value: 'special', label: 'Make a special contribution' },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <Box
                
            >
                <FormControl component="fieldset">
                    <FormLabel component="legend">Radio Group</FormLabel>
                    <RadioGroup
                        aria-label="radioGroup"
                        name="radioOption"
                        value={formData.radioOption}
                        onChange={handleChange}
                    >
                        {radioOptions.map(option => (
                            <Box
                                key={option.value}
                                sx={{
                                    backgroundColor: 'aqua',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    marginBottom: '8px',
                                }}
                            >
                                <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
                            </Box>
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            {formData.radioOption === 'special' && (
                <>
                    <TextField
                        label="Contribution Amount"
                        name="contributionAmount"
                        value={formData.contributionAmount}
                        onChange={handleChange}
                        onBlur={handleFieldBlur}
                        fullWidth
                        margin="normal"
                        error={!!errors.contributionAmount}
                        helperText={errors.contributionAmount}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        required
                    />
                    <TextField
                        label="Contribution Percentage"
                        name="contributionPercentage"
                        value={formData.contributionPercentage}
                        onChange={handleChange}
                        onBlur={handleFieldBlur}
                        fullWidth
                        margin="normal"
                        error={!!errors.contributionPercentage}
                        helperText={errors.contributionPercentage}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.specialContribution}
                                onChange={handleChange}
                                name="specialContribution"
                            />
                        }
                        label="Special Contribution"
                    />
                </>
            )}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        name="agreeTerms"
                    />
                }
                label="Agree to terms"
            />
            <FormLabel component="legend">Participant: {formData.participant}</FormLabel>
            <div>
                <label>Application Date</label>
                <DatePicker
                    selected={formData.applicationDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    customInput={<TextField fullWidth margin="normal" />}
                />
            </div>
            {formData.agreeTerms && (
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            )}
        </form>
    );
};

export default MyForm;
