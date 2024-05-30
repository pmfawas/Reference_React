import { Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { red, green } from '@mui/material/colors';
import Box from '@mui/material/Box';

interface DialogFormProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: 'error' | 'success';
}

const DialogForm: React.FC<DialogFormProps> = ({ open, onClose, title, message, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'error':
                return <ErrorIcon sx={{ color: red[500], fontSize: 40, mr: 1 }} />;
            case 'success':
                return <CheckCircleIcon sx={{ color: green[500], fontSize: 40, mr: 1 }} />;
            default:
                return null;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'error':
                return { borderLeft: `5px solid ${red[500]}`, paddingLeft: '10px' };
            case 'success':
                return { borderLeft: `5px solid ${green[500]}`, paddingLeft: '10px' };
            default:
                return {};
        }
    };

    return (
        <Fragment>
            <Dialog open={open} onClose={onClose} aria-labelledby='dialog-title'>
                <DialogTitle id='dialog-title' sx={getStyles()}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getIcon()}
                        {title}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color={type === 'error' ? 'error' : 'success'} onClick={onClose}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default DialogForm;
