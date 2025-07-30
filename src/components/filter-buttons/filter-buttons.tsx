import React from "react";
import Button from "../button/button";
import "./filter-buttons.scss";

export interface FilterButtonsProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButtons = ({ data }: { data: FilterButtonsProps[] }) => {
  return (
    <div className="filter-buttons">
      {data.map((item) => (
        <Button
          key={item.label}
          type={item.isActive ? "primary" : "secondary"}
          onClick={item.onClick}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;
