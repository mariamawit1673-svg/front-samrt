import { useLang } from "../LanguageContext";

function CropsPage({ crops }) {
  const { t } = useLang();
  return (
    <section className="panel">
      <h2>{t("crops")}</h2>
      <div className="crop-grid">
        {crops.map((crop) => (
          <article className="crop-card" key={crop._id}>
            <h3>{crop.name}</h3>
            <p>{crop.description}</p>
            <dl>
              <dt>{t("soil")}</dt><dd>{crop.soilTypes?.join(", ")}</dd>
              <dt>{t("season")}</dt><dd>{crop.seasons?.join(", ")}</dd>
              <dt>{t("rainfall")}</dt><dd>{crop.waterRequirement}</dd>
              <dt>Harvest</dt><dd>{crop.harvestPeriod || "-"}</dd>
            </dl>
            <p><strong>Fertilizer:</strong> {crop.fertilizerAdvice || "-"}</p>
            <p><strong>{t("pestAdvisory")}:</strong> {crop.pestAdvice || "-"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CropsPage;
