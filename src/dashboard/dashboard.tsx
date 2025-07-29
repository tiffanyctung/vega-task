import React from "react";

const Dashboard = ({ loggedInUser }: { loggedInUser: string }) => {
  return (
    <div>
      <h1>{loggedInUser}'s Dashboard</h1>
    </div>
  );
};

export default Dashboard;
