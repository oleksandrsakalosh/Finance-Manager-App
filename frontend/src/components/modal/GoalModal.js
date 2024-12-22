import React, {useEffect, useState} from 'react';
import './style.css';
import axios from "axios";

const GoalModal = ({ isOpen, onClose, onSubmit, goal, isEditing }) => {
    const [goalFormData, setGoalFormData] = useState({
        name: '',
        targetAmount: '',
        savedAmount: '',
        targetDate: ''
    });

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        if (isEditing && goal) {
            setGoalFormData({
                name: goal.name,
                targetAmount: goal.targetAmount,
                savedAmount: goal.savedAmount,
                targetDate: goal.targetDate
            });
        }
        else {
            setGoalFormData({
                name: '',
                targetAmount: '',
                savedAmount: '',
                targetDate: ''
            });
        }
    }, [isEditing, goal]);

    const handleGoalChange = (e) => {
        const { name, value } = e.target;
        setGoalFormData({ ...goalFormData, [name]: value });
    };

    const handleGoalSubmit = (e) => {
        e.preventDefault();

        const newGoal = {
            name: goalFormData.name,
            targetAmount: goalFormData.targetAmount,
            savedAmount: goalFormData.savedAmount,
            targetDate: goalFormData.targetDate
        }

        if (isEditing) {
            newGoal.goalId = goal.goalId;

            axios.put('http://localhost:8080/api/goals/' + goal.goalId, newGoal, header)
                .catch(error => {
                    console.log(error);
                })
        }
        else {
            axios.post('http://localhost:8080/api/goals', newGoal, header)
                .catch(error => {
                    console.log(error);
                })
        }

        onSubmit(goalFormData);
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
                    <h2>{isEditing ? 'Edit Goal' : 'Add New Goal'}</h2>
                    <button className="modal-close-button" onClick={onClose}><b>X</b></button>
                </div>
                <form onSubmit={handleGoalSubmit}>
                    <label>Goal Name</label>
                    <input className="form-input" type="text" name="name" value={goalFormData.name} onChange={handleGoalChange} required />
                    <label>Target Amount</label>
                    <input className="form-input" type="number" name="targetAmount" value={goalFormData.targetAmount} onChange={handleGoalChange} required />
                    <label>Saved Amount</label>
                    <input className="form-input" type="number" name="savedAmount" value={goalFormData.savedAmount} onChange={handleGoalChange} required />
                    <label>Target Date</label>
                    <input className="form-input" type="date" name="targetDate" value={goalFormData.targetDate} onChange={handleGoalChange} required />
                    <button className="modal-submit-button" type="submit">{isEditing ? 'Update Goal' : 'Add Goal'}</button>
                </form>
            </div>
        </div>
    )
}

export default GoalModal;