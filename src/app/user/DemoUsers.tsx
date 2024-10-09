/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Snackbar from "../components/common/Snackbar";

import type { AppDispatch, RootState } from "@/redux/store";
import { setDemoUsers, setLoading } from "@/redux/features/userSlice";
import { User } from "@/types/user";
import { useGetUsers } from "@/hooks/user";
import { Utility } from "@/utils";
import { Button, Box } from "@mui/material";

interface DemoUsersProps {
  initialData: User[];
}

const DemoUsers: React.FC<DemoUsersProps> = ({ initialData }) => {
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 5,
  });
  const dispatch: AppDispatch = useDispatch();
  const { user, reduxLoading } = useSelector((state: RootState) => state.user);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const { snackbarAndNavigate } = Utility();

  const validInitialData = useMemo(() => {
    return initialData
      ? Array.isArray(initialData)
        ? initialData
        : [initialData]
      : [];
  }, [initialData]);

  useEffect(() => {
    if (validInitialData.length > 0) {
      dispatch(setDemoUsers(validInitialData));
    }
  }, []);

  const { data, swrLoading } = useGetUsers(
    initialData,
    `/todos?&_page=${pageSize.page}&_limit=${pageSize.size}`
  );

  useEffect(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length > validInitialData.length) {
      dispatch(setDemoUsers(dataArray));
    }
  }, [data]);

  const handleFetchNext = () => {
    setPageSize((prevSize) => ({
      ...prevSize,
      size: prevSize.size + 5,
    }));
    dispatch(setLoading(true));
  };

  // Determine which dataset to display
  const displayData =
    user.length > 0
      ? user
      : validInitialData.length > 0
      ? validInitialData
      : [];

  useEffect(() => {
    snackbarAndNavigate(dispatch, true, "warning", "Successfully got");
  }, [data]);

  return (
    <div>
      <ul>
        {displayData.map((val) => (
          <li key={val.id}>{val.title}</li>
        ))}
      </ul>
      {!reduxLoading && !swrLoading ? null : <h1>Loading...</h1>}

      Different approaches to applying the margin to the button

      Option 1: Direct sx prop with 7px margin
      <Button
        variant="contained"
        sx={{ marginTop: "7px" }} // Exact 7px margin from top
        onClick={handleFetchNext}
      >
        Fetch Next
      </Button>

      Option 2: Adding !important to force margin
      <Button
        variant="contained"
        sx={{ marginTop: "7px !important" }} // Force 7px margin
        onClick={handleFetchNext}
      >
        Fetch Next
      </Button>

      Option 3: Wrapping button in Box for additional layout control
      <Box sx={{ mt: 7 }}>
        <Button
          variant="contained"
          onClick={handleFetchNext}
        >
          Fetch Next
        </Button>
      </Box>

      Option 4: Debugging styles to check if margin is being applied
      <Button
        variant="contained"
        sx={{ 
          marginTop: "20px",
          border: "2px solid red" // Visual debugging style
        }}
        onClick={handleFetchNext}
      >
        Fetch Next
      </Button>

      <Snackbar
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
      />
    </div>
  );
};

export default DemoUsers;
