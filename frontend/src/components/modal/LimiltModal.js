import React, {useEffect, useState} from 'react';
import './style.css';
import axios from "axios";

const LimitModal = ({ isOpen, onClose, onSubmit, limit, isEditing }) => {
    const [limitFormData, setLimitFormData] = useState({
        category: '',
        limitAmount: ''
    });

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {

        if (isEditing && limit) {
            setLimitFormData({
                category: limit.category.name,
                limitAmount: limit.amount
            });
        }
        else {
            setLimitFormData({
                category: '',
                limitAmount: ''
            });
        }
    }, [isEditing, limit]);

    const handleLimitChange = (e) => {
        const { name, value } = e.target;
        setLimitFormData({ ...limitFormData, [name]: value });
    };

    const handleLimitSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.get('http://localhost:8080/api/categories/' + limitFormData.category, header);

        let categoryId = null;
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0) ||
            (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
            const newCategory = {
                name: limitFormData.category
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

        const category = {
            categoryId: categoryId,
        }

        const newLimit = {
            category: category,
            amount: limitFormData.limitAmount
        }

        if (isEditing) {
            newLimit.limitId = limit.limitId;

            axios.put('http://localhost:8080/api/limits/' + limit.limitId, newLimit, header)
                .catch(error => {
                    console.log(error);
                })
        } else {
            axios.post('http://localhost:8080/api/limits', newLimit, header)
                .catch(error => {
                    console.log(error);
                })
        }

        onSubmit(limitFormData);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return(
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-content-top">
                    <h2>{isEditing ? 'Edit Limit' : 'Add New Limit'}</h2>
                    <button className="modal-close-button" onClick={onClose}><b>X</b></button>
                </div>
                <form onSubmit={handleLimitSubmit}>
                    <label>Category</label>
                    <input className="form-input" type="text" name="category" value={limitFormData.category} onChange={handleLimitChange} disabled={isEditing} required={!isEditing}/>
                    <label>Limit Amount</label>
                    <input className="form-input" type="number" name="limitAmount" value={limitFormData.limitAmount} onChange={handleLimitChange} required />
                    <button className="modal-submit-button" type="submit">{isEditing ? 'Update Limit' : 'Add Limit'}</button>
                </form>
            </div>
        </div>
    )
}

export default LimitModal;