// components/UserModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/material-renderers';
import { customerSchema, customerUiSchema } from '../schemas/edit/schemas';
import { User } from './Main';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: any) => void;
  user?: any;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState<User>();

  const handleSubmit = () => {
    onSubmit(formData); // Send data to parent component
    onClose(); // Close the modal  
  };

  useEffect(() => {
    setFormData ({...user, price: parseFloat(user?.price ?? '0')}); // Convert price to string
  }, [user]);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <JsonForms
          schema={customerSchema}
          uischema={customerUiSchema}
          data={formData}
          renderers={materialRenderers}
          onChange={({ data }) => setFormData(data)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ 
          color: (theme) => theme.palette.secondary.contrastText 
        }} >Cancel</Button>
        <Button onClick={handleSubmit} sx={{ color: (theme) => theme.palette.primary.contrastText }}
           variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
