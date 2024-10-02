import { Container, Box, Typography, TextField, Alert, Button } from '@mui/material';
import { error } from 'console';
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export interface TravelPlannerProps {
}

export function TravelPlanner({ }: TravelPlannerProps) {
    return (
        <div className="trip-planner">
            <div className="header">
                <h2>Trip Planner</h2>
            </div>
            <div className="content">
                <p>Create trip days and places here...</p>
                {/* Add inputs for trip days and places */}
            </div>
        </div>
    );
};
