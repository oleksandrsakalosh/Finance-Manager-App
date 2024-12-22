import React, {useEffect, useState} from 'react';
import './style.css';

import axios from "axios";

const TransactionModal = ({ isOpen, onClose, onSubmit, isEditing, transaction }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'Income',
        recurring: false,
        frequency: null
    });

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        if (isEditing && transaction) {
            setFormData({
                date: transaction.transactionDate,
                amount: transaction.amount,
                category: transaction.category.name,
                type: transaction.type,
                recurring: transaction.interval !== null,
                frequency: transaction.interval
            });
        }
        else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                category: '',
                type: 'Income',
                recurring: false,
                frequency: null
            });
        }
    }, [isEditing, transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const clearForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: '',
            category: '',
            type: 'Income',
            recurring: false,
            frequency: null
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.get('http://localhost:8080/api/categories/' + formData.category, header);

        let categoryId = null;

        if (!response.data || (Array.isArray(response.data) && response.data.length === 0) ||
            (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
            const newCategory = {
                name: formData.category,
            }

            const category = await axios.post('http://localhost:8080/api/categories', newCategory, header)
                .catch(error => {
                    console.log(error);
                });

            categoryId = category.data.categoryId;
        }
        else {
            categoryId = response.data.categoryId;
        }

        const newTransaction = {
            transactionDate: formData.date,
            amount: formData.amount,
            category: {
                categoryId: categoryId,
            },
            type: formData.type,
            interval: formData.frequency,
            description: null,
        }

        if(isEditing) {
            newTransaction.transactionId = transaction.transactionId;
            axios.put('http://localhost:8080/api/transactions/' + transaction.transactionId, newTransaction, header)
                .catch(error => {
                    console.log(error);
                });
        }
        else{
            axios.post('http://localhost:8080/api/transactions', newTransaction, header)
                .catch(error => {
                    console.log(error);
                });
        }

        onSubmit(formData);
        clearForm();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            clearForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-content-top">
                    <h2>{isEditing ? 'Edit Transaction' : 'Add new Transaction'}</h2>
                    <button className="modal-close-button" onClick={onClose}><b>X</b></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Date</label>
                    <input className="form-input" value={formData.date} onChange={handleChange} type="date" name="date" required />
                    <label>Amount</label>
                    <input className="form-input" value={formData.amount} onChange={handleChange} type="number" name="amount" required />
                    <label>Category</label>
                    <input className="form-input" value={formData.category} onChange={handleChange} type="text" name="category" required />
                    <label>Type</label>
                    <select className="form-input" value={formData.type} onChange={handleChange} name="type" required>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                    <div className="recurring-container">
                        <div className="checkbox-container">
                            <input checked={formData.recurring}
                                   onChange={(e) =>  setFormData({...formData, [e.target.name]: e.target.checked})}
                                   type="checkbox"
                                   name="recurring" />
                            <label>Recurring</label>
                        </div>
                        {formData.recurring && (
                            <div className="frequency-container">
                                <label>Recurring Frequency</label>
                                <select className="form-input" value={formData.frequency} onChange={handleChange} name="frequency">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        )
                        }
                    </div>
                    <button type="submit" className="modal-submit-button">{isEditing ? 'Update Transaction' : 'Add Transaction'}</button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
