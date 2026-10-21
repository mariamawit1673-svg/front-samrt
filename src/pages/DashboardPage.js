import { useState } from "react";
import WeatherWidget from "../components/WeatherWidget";
import { API_BASE } from "../constants";
import { useLang } from "../LanguageContext";

function DashboardPage({ user, profile, history, crops, onNavigate }) {
  const { t } = useLang();
  const [weatherRec, setWeatherRec] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  async function handleWeatherReady(weatherData) {
    const f = weatherData.farming;
    setRecLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soilType: f.soilHint, season: f.season, rainfall: f.rainfall, temperature: f.temperature, location: weatherData.location, irrigationAvailable: false, userId: user?.id }),
      });
      const data = await res.json();
      setWeatherRec({ crops: data.recommendedCrops, advice: data.advice, location: weatherData.location });
    } catch { /* silent */ }
    finally { setRecLoading(false); }
  }

  const recentRecommendation = history[0];
  const soilTypes = new Set(crops.flatMap((crop) => crop.soilTypes || [])).size;
  const profileFields = [profile.location, profile.farmSize, profile.soilType, profile.preferredCrops];
  const completedProfileFields = profileFields.filter(Boolean).length + (profile.irrigationAvailable ? 1 : 0);
  const profileScore = Math.round((completedProfileFields / 5) * 100);
  const soilMatchedCrops = crops.filter((crop) => crop.soilTypes?.includes(profile.soilType));
  const rainyMatches = soilMatchedCrops.filter((crop) => crop.seasons?.includes("rainy")).length;
  const dryMatches = soilMatchedCrops.filter((crop) => crop.seasons?.includes("dry")).length;
  const cropFrequency = history.flatMap((item) => item.recommendedCrops || []).reduce((acc, crop) => ({ ...acc, [crop]: (acc[crop] || 0) + 1 }), {});
  const topCrops = Object.entries(cropFrequency).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <section className="dashboard-page">
      <div className="panel dashboard-hero">
        <div>
          <p className="eyebrow">{t("systemOverview")}</p>
          <h2>{user ? `${t("welcomeBack")}, ${user.name}` : t("welcomeBack")}</h2>
          <p>{t("heroCopy")}</p>
        </div>
        <button onClick={() => onNavigate("recommend")}>{t("newRecommendation")}</button>
      </div>

      <div className="kpi-grid">
        <article><span>{crops.length}</span><p>{t("cropRecords")}</p></article>
        <article><span>{soilTypes}</span><p>{t("soilCategories")}</p></article>
        <article><span>{history.length}</span><p>{t("savedRecommendations")}</p></article>
        <article><span>{profile.irrigationAvailable ? t("yes") : t("no")}</span><p>{t("irrigationAvailable")}</p></article>
      </div>

      <div className="insight-grid">
        <article className="panel insight-card">
          <h3>{t("profileCompleteness")}</h3>
          <strong>{profileScore}%</strong>
          <div className="progress-track"><span style={{ width: `${profileScore}%` }} /></div>
          <p>{profileScore >= 80 ? t("profileReady") || "Profile is ready." : t("addMoreInfo") || "Add more farm information."}</p>
        </article>

        <article className="panel insight-card">
          <h3>{t("soilSuitability")}</h3>
          <strong>{soilMatchedCrops.length}</strong>
          <p>{t("soil")}: <b>{profile.soilType || t("notSaved")}</b></p>
          <div className="mini-bars">
            <div><span>🌧 Rainy</span><strong>{rainyMatches}</strong></div>
            <div><span>☀️ Dry</span><strong>{dryMatches}</strong></div>
          </div>
        </article>

        <article className="panel insight-card next-action">
          <h3>{t("nextAction")}</h3>
          <p>{!user ? t("loginPrompt") || "Login to save profile." : profileScore < 80 ? t("completeProfile") || "Complete your profile." : history.length === 0 ? t("firstRec") || "Generate your first recommendation." : t("reviewPest") || "Review pest advisory."}</p>
          <button onClick={() => onNavigate(profileScore < 80 ? "profile" : "recommend")}>{t("continue")}</button>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <h3>{t("farmerProfile")}</h3>
          <p><strong>{t("location")}:</strong> {profile.location || t("notSaved")}</p>
          <p><strong>{t("soil")}:</strong> {profile.soilType || t("notSaved")}</p>
          <p><strong>{t("farmSize")}:</strong> {profile.farmSize || t("notSaved")}</p>
          <button className="secondary-button" onClick={() => onNavigate("profile")}>{t("manageProfile")}</button>
        </article>

        <article className="panel">
          <h3>{t("latestRecommendation")}</h3>
          {recentRecommendation ? (
            <>
              <p><strong>{t("recommendedCrops")}:</strong> {recentRecommendation.recommendedCrops.join(", ")}</p>
              <p><strong>{t("soilType")}:</strong> {recentRecommendation.soilType}, {recentRecommendation.season}</p>
            </>
          ) : <p>{t("noHistory")}</p>}
          <button className="secondary-button" onClick={() => onNavigate("history")}>{t("viewHistory")}</button>
        </article>

        <article className="panel">
          <h3>{t("cropKnowledge")}</h3>
          <p><strong>{t("totalCropRecords")}:</strong> {crops.length}</p>
          <button className="secondary-button" onClick={() => onNavigate("crops")}>{t("openCropInfo")}</button>
        </article>
      </div>

      <div className="panel dashboard-analysis">
        <h3>{t("recommendation")} Analysis</h3>
        {topCrops.length > 0 ? (
          <div className="analysis-list">
            {topCrops.map(([crop, count]) => (
              <div key={crop}>
                <span>{crop}</span>
                <div className="progress-track"><span style={{ width: `${Math.min(count * 25, 100)}%` }} /></div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        ) : <p>{t("noHistory")}</p>}
      </div>

      <div className="weather-section">
        <div className="panel weather-panel">
          <WeatherWidget onWeatherReady={handleWeatherReady} />
        </div>
        <div className="panel weather-rec-panel">
          <p className="eyebrow">{t("autoRecommendation")}</p>
          <h3>{t("cropsForWeather")}</h3>
          {recLoading && <p className="weather-loading">...</p>}
          {!recLoading && !weatherRec && <p style={{ color: "#888" }}>{t("basedOnWeather")}...</p>}
          {!recLoading && weatherRec && (
            <div>
              <p>{t("basedOnWeather")} <strong>{weatherRec.location}</strong>:</p>
              <div className="weather-crop-tags">
                {weatherRec.crops.slice(0, 6).map((c) => <span key={c} className="weather-crop-tag">{c}</span>)}
              </div>
              <button className="secondary-button" style={{ marginTop: "12px" }} onClick={() => onNavigate("recommend")}>{t("refineRecommendation")}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
