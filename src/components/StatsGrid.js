function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      <div>
        <span>{stats.crops}</span>
        <p>Crop records</p>
      </div>
      <div>
        <span>{stats.soilTypes}</span>
        <p>Soil categories</p>
      </div>
      <div>
        <span>{stats.history}</span>
        <p>Your recommendations</p>
      </div>
    </div>
  );
}

export default StatsGrid;
