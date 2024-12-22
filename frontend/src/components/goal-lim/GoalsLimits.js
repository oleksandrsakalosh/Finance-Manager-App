import React, {useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';
import './style.css';

import GoalModal from '../modal/GoalModal';
import LimitModal from '../modal/LimiltModal';
import axios from "axios";

const GoalsLimits = () => {
    const [goals, setGoals] = useState([]);
    const [limits, setLimits] = useState([]);
    const [loading, setLoading] = useState(true);

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const goalsData = await axios.get('http://localhost:8080/api/goals', header);
                const limitsData = await axios.get('http://localhost:8080/api/limits', header);
                const transactions =
                    await axios.get('http://localhost:8080/api/month-transactions', header);

                const processedLimits = processCategoryData(limitsData.data, transactions.data);

                setGoals(goalsData.data);
                setLimits(processedLimits);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processCategoryData = (limitsData, transactions) => {
        return limitsData.map(limit => {
            const categoryTransactions = transactions.filter(transaction => transaction.category.name === limit.category.name);
            const spentAmount = categoryTransactions.reduce((total, transaction) => total + transaction.amount, 0);

            return {
                ...limit,
                spentAmount: spentAmount
            };
        });
    }

    const generateGoalChartData = (goal) => {
        const color = getGoalColor(goal.savedAmount, goal.targetAmount);

        return {
            labels: ['Saved', 'Remaining'],
            datasets: [
                {
                    data: [goal.savedAmount, (goal.targetAmount - goal.savedAmount < 0 ? 0 : goal.targetAmount - goal.savedAmount)],
                    backgroundColor: [color, '#F5F5F5'],
                    hoverBackgroundColor: [color, '#F5F5F5'],
                },
            ],
        };
    };

    const generateLimitChartData = (limit) => {
        const color = getLimitColor(limit.spentAmount, limit.amount);

        return {
            labels: ['Spent', 'Remaining'],
            datasets: [
                {
                    data: [limit.spentAmount, (limit.amount - limit.spentAmount < 0 ? 0 : limit.amount - limit.spentAmount)],
                    backgroundColor: [color, '#F5F5F5'],
                    hoverBackgroundColor: [color, '#F5F5F5'],
                },
            ],
        };
    };

    const getGoalColor = (currentValue, totalValue) => {
        const progressPercentage = (currentValue / totalValue) * 100;

        if (progressPercentage >= 80) return '#44ce1b';
        if (progressPercentage >= 60) return '#bbdb44';
        if (progressPercentage >= 40) return '#f7e379';
        if (progressPercentage >= 20) return '#f2a134';

        return '#e51f1f';
    };

    const getLimitColor = (currentValue, totalValue) => {
        const progressPercentage = (currentValue / totalValue) * 100;

        if (progressPercentage >= 80) return '#e51f1f';
        if (progressPercentage >= 60) return '#f2a134';
        if (progressPercentage >= 40) return '#f7e379';
        if (progressPercentage >= 20) return '#bbdb44';

        return '#44ce1b';
    };

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);

    const handleOpenGoalModal = (e) => {
        e.preventDefault();
        setIsGoalModalOpen(true);
    };

    const handleEditGoal = (goal) => {
        setCurrentGoal(goal);
        setIsEditing(true);
        setIsGoalModalOpen(true);
    };

    const handleDeleteGoal = (goal) => {
        const success = true;

        axios.delete('http://localhost:8080/api/goals/' + goal.goalId, header).catch(error => {
            console.log(error);
        });

        if (success) {
            setFeedbackMessage('Goal deleted successfully!');
            setFeedbackType('success');
        } else {
            setFeedbackMessage('Failed to delete goal. Please try again.');
            setFeedbackType('error');
        }
    };

    const handleCloseGoalModal = () => {
        setIsGoalModalOpen(false);
        setIsEditing(false);
        setCurrentGoal(null);
    };
    const handleSubmitGoal = (formData) => {
        const success = true;

        if(isEditing){
            if (success) {
                setFeedbackMessage('Goal edited successfully!');
                setFeedbackType('success');
            } else {
                setFeedbackMessage('Failed to edit goal. Please try again.');
                setFeedbackType('error');
            }
        }
        else{
            if (success) {
                setFeedbackMessage('Goal added successfully!');
                setFeedbackType('success');
            } else {
                setFeedbackMessage('Failed to add goal. Please try again.');
                setFeedbackType('error');
            }
        }

        handleCloseGoalModal();
    };

    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isEditingLimit, setIsEditingLimit] = useState(false);
    const [currentLimit, setCurrentLimit] = useState(null);
    const handleOpenLimitModal = (e) => {
        e.preventDefault();
        setIsLimitModalOpen(true);
    };

    const handleEditLimit = (limit) => {
        setCurrentLimit(limit);
        setIsEditingLimit(true);
        setIsLimitModalOpen(true);
    };

    const handleDeleteLimit = (limit) => {
        const success = true;

        axios.delete('http://localhost:8080/api/limits/' + limit.limitId, header).catch(error => {
            console.log(error);
        });

        if (success) {
            setFeedbackMessage('Limit deleted successfully!');
            setFeedbackType('success');
        } else {
            setFeedbackMessage('Failed to delete limit. Please try again.');
            setFeedbackType('error');
        }
    };

    const handleCloseLimitModal = () => {
        setIsLimitModalOpen(false);
        setIsEditingLimit(false);
        setCurrentLimit(null);
    };
    const handleSubmitLimit = (formData) => {
        const success = true;
        if(isEditingLimit){
            if (success) {
                setFeedbackMessage('Limit edited successfully!');
                setFeedbackType('success');
            } else {
                setFeedbackMessage('Failed to edit limit. Please try again.');
                setFeedbackType('error');
            }
        }
        else{
            if (success) {
                setFeedbackMessage('Limit added successfully!');
                setFeedbackType('success');
            } else {
                setFeedbackMessage('Failed to add limit. Please try again.');
                setFeedbackType('error');
            }
        }


        handleCloseLimitModal();
    };

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('');

    const handleCloseFeedback = () => {
        setFeedbackMessage('');
        setFeedbackType('');
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="goals-limits-container">
            <div className="goals-container">
                <div className="goals-container-header">
                    <h2>Goals</h2>
                </div>
                <button className="add-goal-limit" onClick={handleOpenGoalModal} >+</button>
                {goals.map((goal, index) => (
                    <div key={index} className="goal-card">
                        <div className="goal-card-header">
                            <h3>{goal.name}</h3>
                            <h3>{((goal.savedAmount / goal.targetAmount) * 100).toFixed(2)}%</h3>
                            <div className="goal-card-buttons">
                                <button onClick={() => handleEditGoal(goal)} className="edit-goal-button">Edit</button>
                                <button onClick={() => handleDeleteGoal(goal)} className="delete-goal-button">Delete</button>
                            </div>
                        </div>
                        <div className="goal-card-content">
                            <div className="goal-card-left">
                                <p>Target Amount: ${goal.targetAmount}</p>
                                <p>Saved Amount: ${goal.savedAmount}</p>
                                <p>Target Date: {goal.targetDate}</p>
                            </div>
                            <div className="goal-card-right">
                                <Doughnut
                                    data={generateGoalChartData(goal)}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        let label = context.label || '';
                                                        if (label) {
                                                            label += ': ';
                                                        }
                                                        if (context.parsed) {
                                                            label += '$' + context.parsed;
                                                        }
                                                        return label;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="limits-container">
                <div className="limits-container-header">
                    <h2>Limits</h2>
                </div>

                <button className="add-goal-limit" onClick={handleOpenLimitModal}>+</button>

                {limits.map((limit, index) => (
                    <div key={index} className="limit-card">
                        <div className="limit-card-header">
                            <h3>{limit.category.name}</h3>
                            <h3>{((limit.spentAmount / limit.amount) * 100).toFixed(2)}%</h3>
                            <div className="limit-card-buttons">
                                <button onClick={() => handleEditLimit(limit)} className="edit-limit-button">Edit</button>
                                <button onClick={() => handleDeleteLimit(limit)} className="delete-limit-button">Delete</button>
                            </div>
                        </div>
                        <div className="limit-card-content">
                            <div className="limit-card-left">
                                <p>Limit Amount: ${limit.amount}</p>
                                <p>Spent Amount: ${limit.spentAmount}</p>
                            </div>
                            <div className="limit-card-right">
                                <Doughnut
                                    data={generateLimitChartData(limit)}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        let label = context.label || '';
                                                        if (label) {
                                                            label += ': ';
                                                        }
                                                        if (context.parsed) {
                                                            label += '$' + context.parsed;
                                                        }
                                                        return label;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {feedbackMessage && (
                <div className={`feedback-message ${feedbackType}`}>
                    {feedbackMessage}
                    <button onClick={handleCloseFeedback}>X</button>
                </div>
            )}

            <GoalModal
                isOpen={isGoalModalOpen}
                onClose={handleCloseGoalModal}
                onSubmit={handleSubmitGoal}
                goal={currentGoal}
                isEditing={isEditing}
            />
            <LimitModal
                isOpen={isLimitModalOpen}
                onClose={handleCloseLimitModal}
                onSubmit={handleSubmitLimit}
                limit={currentLimit}
                isEditing={isEditingLimit}
            />
        </div>
    );
};

export default GoalsLimits;

