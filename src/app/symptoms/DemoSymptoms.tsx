/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import { setSymptoms, setLoading } from '@/redux/features/symptomsSlice';
import { Symptoms } from '@/types/symptoms';
import { useGetSymptoms } from '@/hooks/symptoms';

interface DemoSymptomsProps {
    initialData: Symptoms[];
};

const DemoSymptomss: React.FC<DemoSymptomsProps> = ({ initialData }) => {
    const [pageSize, setPageSize] = useState({
        page: 1,
        size: 5
    });
    const dispatch: AppDispatch = useDispatch();
    const { symptoms, reduxLoading } = useSelector((state: RootState) => state.symptoms);
    console.log("symptoms:",symptoms);

    const validInitialData = useMemo(() => {
        return initialData ? (Array.isArray(initialData) ? initialData : [initialData]) : [];
    }, [initialData]);

    useEffect(() => {
        if (validInitialData.length > 0) {
            dispatch(setSymptoms(validInitialData));
        }
    }, []);

    const { data, swrLoading } = useGetSymptoms(initialData, `http://localhost:3001/api/symptoms/get-symptoms`);

    useEffect(() => {
        const dataArray = Array.isArray(data) ? data : [data];
        if (dataArray.length > validInitialData.length) {
            dispatch(setSymptoms(dataArray));
        }
    }, [data]);

    const handleFetchNext = () => {
        setPageSize(prevSize => ({
            ...prevSize,
            size: prevSize.size + 5,
        }));
        dispatch(setLoading(true));
    };

    // Determine which dataset to display
    const displayData = symptoms.length > 0 ? symptoms : (validInitialData.length > 0 ? validInitialData : []);

    return (
        <div>
            <ul>
                {displayData.map((val) => (
                    <li key={val.id}>{val.name}</li>
                ))}
            </ul>
            {!reduxLoading && !swrLoading ? null :
                <h3>LOADING...</h3>
            }
            <button onClick={handleFetchNext}>Fetch Next</button>
        </div>
    );
}

export default DemoSymptomss;
