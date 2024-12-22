import React, { useState } from 'react';
import './style.css';

const SelectorBox = ({ onSelect }) => {
    const [selected, setSelected] = useState('Expenses');

    const handleSelect = (option) => {
        setSelected(option);
        onSelect(option);
    };

    return (
        <div className="selector-box">
            <button
                className={`selector-button ${selected === 'Expenses' ? 'active' : ''}`}
                onClick={() => handleSelect('Expenses')}
            >
                Expenses
            </button>
            <button
                className={`selector-button ${selected === 'Incomes' ? 'active' : ''}`}
                onClick={() => handleSelect('Incomes')}
            >
                Incomes
            </button>
        </div>
    );
};

export default SelectorBox;
