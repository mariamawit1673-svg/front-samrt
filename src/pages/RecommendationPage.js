import SelectField from "../components/SelectField";
import { rainfallOptions, seasonOptions, soilOptions, temperatureOptions } from "../constants";
import { useLang } from "../LanguageContext";

function RecommendationPage({ form, latestRecommendation, onFormChange, onSubmit }) {
  const { t } = useLang();
  return (
    <section className="recommendation-layout">
      <div className="panel recommendation-intro">
        <p className="eyebrow">Decision Support</p>
        <h2>{t("cropRecommendation")}</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <SelectField label={t("soilType")} value={form.soilType} onChange={(v) => onFormChange({ ...form, soilType: v })} options={soilOptions} />
          <SelectField label={t("season")} value={form.season} onChange={(v) => onFormChange({ ...form, season: v })} options={seasonOptions} />
          <SelectField label={t("rainfall")} value={form.rainfall} onChange={(v) => onFormChange({ ...form, rainfall: v })} options={rainfallOptions} />
          <SelectField label={t("temperature")} value={form.temperature} onChange={(v) => onFormChange({ ...form, temperature: v })} options={temperatureOptions} />
          <label>
            {t("location")}
            <input value={form.location} onChange={(e) => onFormChange({ ...form, location: e.target.value })} />
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.irrigationAvailable} onChange={(e) => onFormChange({ ...form, irrigationAvailable: e.target.checked })} />
            {t("irrigationAvailable")}
          </label>
          <button type="submit">{t("getRecommendation")}</button>
        </form>
      </div>
      {latestRecommendation && (
        <div className="result-box recommendation-result">
          <h3>{t("recommendedCrops")}</h3>
          <p>{latestRecommendation.recommendedCrops.join(", ")}</p>
          <h3>{t("advice")}</h3>
          <ul>{latestRecommendation.advice.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

export default RecommendationPage;
