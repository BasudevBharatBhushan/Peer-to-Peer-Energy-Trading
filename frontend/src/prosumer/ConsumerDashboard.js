import React from "react";
import Base from "../core/Base";
import { Checkbox } from "semantic-ui-react";

import { useNavigate } from "react-router-dom";

const ConsumerDashboard = () => {
  const navigate = useNavigate();

  const handleToggleTrigger = () => {
    navigate("/prosumer/dashboard");
  };
  return (
    <div>
      <Base title="Consumer Dashboard" TitleColour="violet" />
      <Checkbox
        toggle
        onChange={() => {
          {
            console.log("Toggle Triggered");
            handleToggleTrigger();
          }
        }}
      />
    </div>
  );
};

export default ConsumerDashboard;
