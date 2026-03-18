import ChartCard from "./ChartCard";

const Dashboard = ({ charts }) => {
  return (
    <div className=" container mt-5">

      <div className=" row g-4">

        {charts.map((chart, index) => (
          <div key={index} className="col-lg-6 col-xl-6">
            <ChartCard chart={chart} />
          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;