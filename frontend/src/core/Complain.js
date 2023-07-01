import React from "react";
import Base from "./Base";
import ComplainCard from "./components/ComplainCard";

const Complain = () => {
  return (
    <div>
      <Base title="Complain" TitleColour="green">
        <ComplainCard />
      </Base>
    </div>
  );
};

export default Complain;
