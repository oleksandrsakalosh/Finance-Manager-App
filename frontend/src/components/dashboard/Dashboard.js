import React, {useEffect, useState} from 'react';
import './style.css';
import {Chart as ChartJS} from 'chart.js/auto';
import { Line, Pie } from 'react-chartjs-2';
import axios from 'axios';

import TransactionModal from "../modal/TransactionModal";
import GoalModal from "../modal/GoalModal";

const Dashboard = () => {
    const [dailyData, setDailyData] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [goalsData, setGoalsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const header = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const balanceData = await axios.get('http://localhost:8080/api/balance-history', header);
                const transactions = await axios.get('http://localhost:8080/api/week-transactions', header);
                const goals = await axios.get('http://localhost:8080/api/goals', header);

                const processedCategoryData = processCategoryData(transactions.data);

                setDailyData(balanceData.data);
                setCategoryData(processedCategoryData);
                setTransactionHistory(transactions.data);
                setGoalsData(goals.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processCategoryData = (transactions) => {
        const categoryMap = new Map();
        transactions.forEach(transaction => {
            if(transaction.type === 'Expense') {
                if (categoryMap.has(transaction.category.name)) {
                    categoryMap.set(transaction.category.name, categoryMap.get(transaction.category.name) + transaction.amount);
                } else {
                    categoryMap.set(transaction.category.name, transaction.amount);
                }
            }
        });

        const labels = Array.from(categoryMap.keys());
        const data = Array.from(categoryMap.values());

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                }
            ]
        };
    };

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isEditingTransaction, setIsEditingTransaction] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState({});

    const handleOpenTransactionModal = (e) => {
        e.preventDefault();
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setIsTransactionModalOpen(false);
        if(isEditingTransaction) {
            setIsEditingTransaction(false);
            setCurrentTransaction({});
        }
    };

    const handleSubmitTransaction = () => {
        handleCloseTransactionModal();
    };

    const handleEditTransaction = (transaction) => {
        setIsEditingTransaction(true);
        setCurrentTransaction(transaction);
        setIsTransactionModalOpen(true);
    }

    const handleDeleteTransaction = (transaction) => {
        axios.delete('http://localhost:8080/api/transactions/' + transaction.transactionId, header).catch(error => {
            console.log(error);
        });
    }

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [currentGoal, setCurrentGoal] = useState({});

    const handleOpenGoalModal = (e) => {
        e.preventDefault();
        setIsGoalModalOpen(true);
    };

    const handleEditGoal = (goal) => {
        setIsEditingGoal(true);
        setCurrentGoal(goal);
        setIsGoalModalOpen(true);
    }

    const handleDeleteGoal = (goal) => {
        axios.delete('http://localhost:8080/api/goals/' + goal.goalId, header).catch(error => {
            console.log(error);
        });
    }

    const handleCloseGoalModal = () => {
        setIsGoalModalOpen(false);
    };

    const handleSubmitGoal = () => {
        handleCloseGoalModal();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Your Weekly sumup</h1>
            <div className="summary-container">
                <div className="financial-summary">
                    <div className="summary-item left">
                        <h3>Balance History</h3>
                        <div className="chart-container">
                            <Line
                                data={{
                                    labels: dailyData.map(data => data.label),
                                    datasets: [
                                        {
                                            label: 'Balance',
                                            data: dailyData.map(data => data.balance),
                                            fill: true,
                                            backgroundColor: 'rgba(74, 144, 226, 0.2)',
                                            borderColor: '#4A90E2',
                                            pointBackgroundColor: '#4A90E2',
                                            pointBorderColor: '#fff',
                                            pointHoverBackgroundColor: '#fff',
                                            pointHoverBorderColor: '#4A90E2',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    return `Daily: $${tooltipItem.raw}`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            title: {
                                                display: false,
                                            },
                                            grid: {
                                                display: false,
                                            }
                                        },
                                        y: {
                                            title: {
                                                display: false,
                                            },
                                            grid: {
                                                display: true,
                                                borderDash: [2, 2],
                                            },
                                            ticks: {
                                                callback: function (value) {
                                                    return `$${value}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="summary-item left">
                        <h3><a href="/incomes-expenses">Latest Transaction</a> <a href="/" className="add-transaction-button" onClick={handleOpenTransactionModal} >+</a></h3>
                        <div className="scrollTable">
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {transactionHistory.map(transaction => (
                                    <tr key={transaction.transactionId}>
                                        <td>{transaction.transactionDate}</td>
                                        <td>{transaction.category.name}</td>
                                        <td className={transaction.type === 'Income' ? 'positive' : 'negative'}>
                                            {transaction.amount}$
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditTransaction(transaction)} className="edit-transaction-button">Edit</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDeleteTransaction(transaction)} className="delete-transaction-button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="financial-summary">
                    <div className="summary-item right">
                        <div className="goals-section">
                            <h3><a href="/goals-limits">Your Goals</a> <a href="/" className="add-goal-button" onClick={handleOpenGoalModal} >+</a></h3>
                            <ul>
                                {goalsData.map(goal => (
                                    <li key={goal.goalId} className="goal-item">
                                        <div className="goal-item-left">
                                            <div className="goal-header">
                                                <span className="goal-name">{goal.name}</span>
                                                <span className="goal-percentage">{((goal.savedAmount / goal.targetAmount) * 100)}%</span>
                                                <span className="goal-amount">{goal.savedAmount} / {goal.targetAmount}$</span>
                                            </div>
                                            <div className="goal-progress-bar">
                                                <div className="goal-progress"
                                                     style={{ width: `${(goal.savedAmount / goal.targetAmount) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="goal-item-right">
                                            <button onClick={() => handleEditGoal(goal)} className="edit-goal-button">Edit</button>
                                            <button onClick={() => handleDeleteGoal(goal)} className="delete-goal-button">Delete</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="summary-item right">
                        <h3>Category Spending</h3>
                        <div className="chart-container">
                            <Pie
                                data={categoryData}
                                weight={70}
                                height={50}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top'
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    return `${tooltipItem.label}: $${tooltipItem.raw}`;
                                                }
                                            }
                                        }
                                    }
                                }}

                            />
                        </div>
                    </div>
                </div>
            </div>
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={handleCloseTransactionModal}
                onSubmit={handleSubmitTransaction}
                isEditing={isEditingTransaction}
                transaction={currentTransaction}
            />
            <GoalModal
                isOpen={isGoalModalOpen}
                onClose={handleCloseGoalModal}
                onSubmit={handleSubmitGoal}
                isEditing={isEditingGoal}
                goal={currentGoal}
            />
        </div>
    );
};

export default Dashboard;

